import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

// Async thunk to fetch other costs from Firestore
export const fetchOtherCosts = createAsyncThunk("otherCosts/fetchOtherCosts", async (userId) => {
  const otherCostsRef = collection(db, "users", userId, "otherCosts");
  const otherCostsSnap = await getDocs(otherCostsRef);
  return otherCostsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

// Async thunk to add an other cost
export const addOtherCost = createAsyncThunk("otherCosts/addOtherCost", async ({ userId, cost }) => {
  const docRef = await addDoc(collection(db, "users", userId, "otherCosts"), cost);
  return { id: docRef.id, ...cost };
});

// Async thunk to edit an other cost
export const editOtherCost = createAsyncThunk("otherCosts/editOtherCost", async ({ userId, costId, updatedCost }) => {
  const costRef = doc(db, "users", userId, "otherCosts", costId);
  await updateDoc(costRef, updatedCost);
  return { id: costId, ...updatedCost };
});

// Async thunk to delete an other cost
export const deleteOtherCost = createAsyncThunk("otherCosts/deleteOtherCost", async ({ userId, costId }) => {
  const costRef = doc(db, "users", userId, "otherCosts", costId);
  await deleteDoc(costRef);
  return costId;
});

const otherCostsSlice = createSlice({
  name: "otherCosts",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOtherCosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editOtherCost.fulfilled, (state, action) => {
        const index = state.list.findIndex((cost) => cost.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.list = state.list.filter((cost) => cost.id !== action.payload);
      });
  },
});

export default otherCostsSlice.reducer;