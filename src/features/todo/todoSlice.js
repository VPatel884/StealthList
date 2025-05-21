import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api";

// Fetch todos
export const fetchTodos = createAsyncThunk("todos/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await API.get("/todos");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch todos");
  }
});

// Add todo
export const addTodo = createAsyncThunk("todos/add", async (text, { rejectWithValue }) => {
  try {  
    const res = await API.post("/todos", { text });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to add todo");
  }
});

// Toggle todo
export const toggleTodo = createAsyncThunk("todos/toggle", async (todo, { rejectWithValue }) => {
  try {
    const res = await API.put(`/todos/${todo._id}`, {
      completed: !todo.completed,
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to toggle todo");
  }
});

// Edit todo
export const editTodo = createAsyncThunk("todos/edit", async ({ id, text }, { rejectWithValue }) => {
  try {
    const res = await API.put(`/todos/${id}`, { text });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to edit todo");
  }
});


// Delete todo
export const deleteTodo = createAsyncThunk("todos/delete", async (id, { rejectWithValue }) => {
  try {
    await API.delete(`/todos/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete todo");
  }
});

// Clear all todos
export const clearTodos = createAsyncThunk("todos/clear", async (_, { rejectWithValue }) => {
  try {
    await API.delete("/todos");
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to clear todos");
  }
});

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(editTodo.fulfilled, (state, action) => {
       const index = state.items.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo._id !== action.payload);
      })

      .addCase(clearTodos.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default todoSlice.reducer;
