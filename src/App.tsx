// import { useState, useEffect } from 'react';
// import { supabase } from './utils/supabase';

// type Todo = {
//   id: number;
//   name: string;
// };

// export default function App() {
//   const [todos, setTodos] = useState<Todo[]>([]);

//   useEffect(() => {
//     async function getTodos() {
//       const { data: todos, error } = await supabase
//         .from('todos')
//         .select();

//       if (error) {
//         console.error(error);
//         return;
//       }

//       if (todos) {
//         setTodos(todos);
//       }
//     }

//     getTodos();
//   }, []);

//   return (
//     <ul>
//       {todos.map((todo) => (
//         <li key={todo.id}>{todo.name}</li>
//       ))}
//     </ul>
//   );
// }