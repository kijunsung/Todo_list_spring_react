import './App.css'
import { useEffect, useState } from 'react';
import type { Todo } from './types/Todo';
import TodoForm from "./components/TodoForm"
import {TodoList} from "./components/TodoList"
import { getAllTodos, addTodoApi, toggleTodoApi, deleteTodoApi } from './services/todoService';
// import { v4 as uuid } from 'uuid';

function App() {
  // 로컬 스토리지에서의 사용법
  // const [ todos, setTodos ] = useState<Todo[]>(() => {
  //   const storedTodos = localStorage.getItem('todos');
  //   return storedTodos ? JSON.parse(storedTodos): [];
  // });

  const [ todos, setTodos ] = useState<Todo[]>([]);
  const [ isLoading, setIsLoading ] = useState<boolean>(true);


  // 최초 랜더링 시 useEffect
  useEffect(() => {
    const fetchTodosFromServer = async (): Promise<void> => {
      try{
        setIsLoading(true);
        const serverTodos = await getAllTodos();
        setTodos(serverTodos);
      } catch (error) {
        console.log('서버에서 데이터를 가져오기 실패 : ', error)
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodosFromServer();
  }, []);

  // uuid를 사용하는 로컬
  // const addTodo = (text: string) => {
  //   const newTodo: Todo = {
  //     id: uuid(),
  //     text,
  //     completed: false,
  //   }
  //   const updatedTodos = [ ...todos, newTodo ];
  //   console.log('updatedTodos --->', updatedTodos);
  //   setTodos(updatedTodos);
  //   localStorage.setItem('todos', JSON.stringify(updatedTodos));
  // }

  const handleAddTodo = async (text: string): Promise<void> => {
    try {
      setIsLoading(true);
      const newTodo = await addTodoApi(text);
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.log(`todo를 추가하는 데 실패했습니다 : `, error);
    }
  }

  // uuid 사용하는 로컬의 delete update
  // const deleteTodo = (id: string) => {
  //   const updatedTodos = todos.filter((todo) => todo.id !== id);
  //   setTodos(updatedTodos);
  //   localStorage.setItem('todos', JSON.stringify(updatedTodos));
  // }

  // const toggleComplete = (id: string) => {
  //   const updatedTodos = todos.map((todo) => todo.id === id ? {...todo, completed: !todo.completed } : todo );
  //   setTodos(updatedTodos);
  //   localStorage.setItem('todos', JSON.stringify(updatedTodos));
  // }

  const handleToggleComplete = async (id: number): Promise<void> => {
    try {
      const todoToToggle = todos.find(todo => todo.id === id);
      if (!todoToToggle) return;
      const updateTodo = await toggleTodoApi(id, todoToToggle.completed);
      setTodos(prevTodos => 
        prevTodos.map(todo => (todo.id === id ? updateTodo : todo))
      );
    } catch (error) {
      console.log("완료 상태 변경에 실패했습니다 : ", error);
    }
  }

  const handleDeleteTodo = async (id: number): Promise<void> => {
    try {
      await deleteTodoApi(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      console.log('todo를 지우는데 실패했습니다 : ', error);
    }
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={handleAddTodo}/>
      {/* //Todoform -> 투두를 입력하면 */
        isLoading ? (
          <p>목록을 불러오는 중입니다...</p>
        ) : (
          <TodoList todos={todos} onToggleComplete={handleToggleComplete} onDeleteTodo={handleDeleteTodo}/>
        )
      }
    </div>
  )
}

export default App