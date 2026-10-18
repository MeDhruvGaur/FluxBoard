import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SupportedLanguage = 'en' | 'es' | 'de' | 'fr';

export interface UIState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  language: SupportedLanguage;
  searchQuery: string;
  activeFilter: string;
  isExportModalOpen: boolean;
  soundEnabled: boolean;
}

const initialState: UIState = {
  theme: 'dark',
  sidebarOpen: true,
  language: 'en',
  searchQuery: '',
  activeFilter: 'all',
  isExportModalOpen: false,
  soundEnabled: true
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<'dark' | 'light'>) => {
      state.theme = action.payload;
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLanguage: (state, action: PayloadAction<SupportedLanguage>) => {
      state.language = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveFilter: (state, action: PayloadAction<string>) => {
      state.activeFilter = action.payload;
    },
    setExportModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExportModalOpen = action.payload;
    },
    toggleSound: (state) => {
      state.soundEnabled = !state.soundEnabled;
    }
  }
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLanguage,
  setSearchQuery,
  setActiveFilter,
  setExportModalOpen,
  toggleSound
} = uiSlice.actions;

export default uiSlice.reducer;
