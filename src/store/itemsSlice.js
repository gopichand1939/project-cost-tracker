import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// Async thunk to fetch items from Firestore
export const fetchItems = createAsyncThunk("items/fetchItems", async (userId) => {
  const itemsRef = collection(db, "users", userId, "items");
  const itemsSnap = await getDocs(itemsRef);
  return itemsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Async thunk to add an item
export const addItem = createAsyncThunk("items/addItem", async ({ userId, item }) => {
  const docRef = await addDoc(collection(db, "users", userId, "items"), item);
  return { id: docRef.id, ...item };
});

// Async thunk to edit an item
export const editItem = createAsyncThunk("items/editItem", async ({ userId, itemId, updatedItem }) => {
  const itemRef = doc(db, "users", userId, "items", itemId);
  await updateDoc(itemRef, updatedItem);
  return { id: itemId, ...updatedItem };
});

// Async thunk to delete an item
export const deleteItem = createAsyncThunk("items/deleteItem", async ({ userId, itemId }) => {
  const itemRef = doc(db, "users", userId, "items", itemId);
  await deleteDoc(itemRef);
  return itemId;
});

const itemsSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editItem.fulfilled, (state, action) => {
        const index = state.list.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
      });
  },
});

export default itemsSlice.reducer;