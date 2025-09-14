import express from 'express';
import { createTodo, getTodos, deleteTodo, updateTodo } from '../controllers/TodoControllers.js';

const router = express.Router();

router.post('/', createTodo);
router.get('/', getTodos);
router.delete('/:id', deleteTodo);
router.patch('/:id', updateTodo);

export default router;
