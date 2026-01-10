import { TableColumn } from "../components/users-table/users-table.component";

export const dataTelegramColumns: TableColumn[] = [
    { header: 'Name', key: 'first_name', class: 'text-gray-800 font-bold' },
    { header: 'Email', key: 'email', class: 'text-indigo-400' },
    { header: 'Lang', key: 'language_code' },
    { header: 'Date', key: 'created_at', pipe: 'date', pipeFormat: 'dd.MM.yyyy' }
  ];

  
  export const dataSiteColumns: TableColumn[] = [
    { header: 'Name', key: 'user_name', class: 'text-gray-800 font-bold' },
    { header: 'Email', key: 'email', class: 'text-indigo-400' },
    { header: 'Site', key: 'site_url' },
    { header: 'Date', key: 'updated_at', pipe: 'date', pipeFormat: 'dd.MM.yyyy' }
  ];