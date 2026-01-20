import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { QuizPreview } from './interfaces/quiz-preview.interface'; // подставь правильный путь
import { QuizAdminService } from '../../../shared/services/quiz-admin.service'; // подставь свой путь
import { QuizLandingPreview } from './interfaces/quiz-landing-preview.interface'
import { QuizFormData, QuizQuestion, QuizServerData } from './interfaces/quiz-form.interface';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  landings: QuizLandingPreview[] = [];
  quizzes: QuizPreview[] = [];
  filteredQuizzes: QuizPreview[] = [];
  selectedLandingId: number | null = null;   // ← теперь id, а не url
  loadingLandings = true;
  loadingQuizzes = false;
  loading = false;
  editingQuizId: number | null = null;    
  editingQuiz: Partial<QuizFormData> | null = null;
  resultMessage: string = '';
  quizzesByLanding: { landing: QuizLandingPreview; quizzes: QuizPreview[] }[] = [];
  isEditLoad = false;
  constructor(
    private quizService: QuizAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadLandings();
    this.loadQuizzes(); // сразу грузим все квизы (или можно отложить)
  }

  // Запуск создания
  startCreate() {
    this.editingQuizId = -1;
    this.editingQuiz = null; // форма сама инициализирует дефолтные значения
    this.cdr.markForCheck();
  }

  private groupQuizzesByLanding(): void {
    const map = new Map<number, QuizPreview[]>();

    // Группируем квизы по landingId
    this.filteredQuizzes.forEach(quiz => {
      // Берём id из landing объекта (он обязательный в интерфейсе)
      const landingId = quiz.landing.id;
      
      if (!map.has(landingId)) {
        map.set(landingId, []);
      }
      map.get(landingId)!.push(quiz);
    });

    // Преобразуем в массив с данными лендинга
    this.quizzesByLanding = [];
    map.forEach((quizzes, landingId) => {
      const landing = this.landings.find(l => l.id === landingId);
      if (landing) {
        this.quizzesByLanding.push({ landing, quizzes });
      } else {
        // Если лендинг не найден, создаём заглушку
        this.quizzesByLanding.push({
          landing: { 
            id: landingId, 
            url: 'Неизвестный', 
            name: 'Без лендинга', 
            status: '0', 
            createdAt: '', 
            quizCount: quizzes.length 
          },
          quizzes
        });
      }
    });

    // Сортируем по имени лендинга
    this.quizzesByLanding.sort((a, b) => a.landing.name.localeCompare(b.landing.name));
  }


  loadLandings() {
    this.loadingLandings = true;
    this.quizService.getAllLandings().subscribe({
      next: (landings) => {
        this.landings = landings;
        this.loadingLandings = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingLandings = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadQuizzes() {
    this.loadingQuizzes = true;
    this.quizService.getQuizzesByLanding(this.selectedLandingId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
        this.filteredQuizzes = [...quizzes];
        this.sortQuizzes();
        this.groupQuizzesByLanding();  // ← добавь эту строку
        this.loadingQuizzes = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingQuizzes = false;
        this.cdr.markForCheck();
      }
    });
  }


  onLandingChange(landingId: string | null) {
    this.selectedLandingId = landingId ? Number(landingId) : null;
    this.loadQuizzes(); // перезагружаем квизы при смене лендинга
  }

  private sortQuizzes() {
    this.filteredQuizzes.sort((a, b) => {
      if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Запуск редактирования
  startEdit(preview: QuizPreview) {
    console.log('startEdit вызван для quiz id:', preview.id);

    this.isEditLoad = true;
    this.cdr.markForCheck(); // ← обновляем UI, показываем лоадер

    this.quizService.getQuizById(preview.id).subscribe({
      next: (full: QuizServerData) => {
        try {
          let parsedQuestions: QuizQuestion[] = [];
          if (typeof full.questions === 'string') {
            parsedQuestions = JSON.parse(full.questions) || [];
          }

          this.editingQuiz = {
            ...full,
            questions: parsedQuestions
          };

          this.editingQuizId = preview.id; // ← важно! иногда забывают

          console.log('editingQuiz установлен:', this.editingQuiz);

          this.isEditLoad = false;
          this.cdr.markForCheck(); // ← КРИТИЧЕСКИ важно после изменения состояния
        } catch (e) {
          console.error('Ошибка при подготовке editingQuiz:', e);
          this.resultMessage = 'Ошибка подготовки данных квиза';
          this.autoCloseMessage()
          this.isEditLoad = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Ошибка загрузки квиза:', err);
        this.resultMessage ='Не удалось загрузить квиз';
        this.autoCloseMessage()
        this.isEditLoad = false;
        this.cdr.markForCheck();
      }
    });
  }
  // Сохранение (универсальное для create/edit)
  saveQuiz(data: any) { 
    if (this.editingQuizId === -1) {
      // Создание
      this.quizService.createQuiz(data).subscribe({
        next: () => {
          this.resultMessage = 'Квиз создан!';
          this.autoCloseMessage()
          this.cancelEdit();
          this.loadQuizzes();
        },
        error: err => this.resultMessage = 'Ошибка создания: ' + err.message
        
      });
    } else if (this.editingQuizId) {
      // Редактирование
      this.quizService.updateQuiz(this.editingQuizId, data).subscribe({
        next: () => {
          this.resultMessage = 'Квиз обновлён!';
          this.autoCloseMessage()
          this.cancelEdit();
          this.loadQuizzes();
        },
        error: err => this.resultMessage = 'Ошибка обновления: ' + err.message
      });
    }
  }

  // Отмена/выход из формы
  cancelEdit() {
    this.editingQuizId = null;
    this.editingQuiz = null;
    this.cdr.markForCheck();
  }

  autoCloseMessage(): void{
    setTimeout(() =>{
        this.resultMessage = '';
    }, 3000)
  }
  cancelMessage(): void {
    this.resultMessage = '';
  }
}