import apiClient from './apiClient';
import { LessonStatus } from '../types/enums';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  videoUrl: string | null;
  transcript: string | null;
  duration: number;
  order: number;
  status: LessonStatus;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLessonData {
  title: string;
  description: string;
  courseId: string;
  video?: File;
  image?: File;
  transcript?: string;
  order?: number;
  isFree?: boolean;
  status?: LessonStatus;
}

export interface UpdateLessonData {
  title?: string;
  description?: string;
  courseId?: string;
  video?: File;
  image?: File;
  transcript?: string;
  order?: number;
  isFree?: boolean;
  status?: LessonStatus;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  watched: number;
}

export const lessonService = {
  async getLessons(): Promise<Lesson[]> {
    try {
      // This endpoint might not exist directly - we might need to fetch courses first
      // and then get lessons for each course
      const response = await apiClient.get<Lesson[]>('/lesson');
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw new Error('Dərsləri yükləmək mümkün olmadı');
    }
  },

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      const response = await apiClient.get<Lesson[]>(`/lesson/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      throw new Error('Kurs dərslərini yükləmək mümkün olmadı');
    }
  },

  async getLesson(id: string): Promise<Lesson> {
    try {
      const response = await apiClient.get<Lesson>(`/lesson/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson ${id}:`, error);
      throw new Error('Dərsi yükləmək mümkün olmadı');
    }
  },

  async createLesson(lessonData: CreateLessonData): Promise<Lesson> {
    try {
      const formData = new FormData();
      formData.append('title', lessonData.title);
      formData.append('description', lessonData.description);
      formData.append('courseId', lessonData.courseId);
      
      if (lessonData.order !== undefined) {
        formData.append('order', lessonData.order.toString());
      }
      
      if (lessonData.isFree !== undefined) {
        formData.append('isFree', lessonData.isFree.toString());
      }
      
      if (lessonData.status) {
        formData.append('status', lessonData.status);
      }
      
      if (lessonData.transcript) {
        formData.append('transcript', lessonData.transcript);
      }
      
      if (lessonData.video) {
        formData.append('video', lessonData.video);
      }
      
      if (lessonData.image) {
        formData.append('image', lessonData.image);
      }

      const response = await apiClient.post<Lesson>('/lesson', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw new Error('Dərsi yaratmaq mümkün olmadı');
    }
  },

  async updateLesson(id: string, lessonData: UpdateLessonData): Promise<Lesson> {
    try {
      const formData = new FormData();
      
      if (lessonData.title) {
        formData.append('title', lessonData.title);
      }
      
      if (lessonData.description) {
        formData.append('description', lessonData.description);
      }
      
      if (lessonData.courseId) {
        formData.append('courseId', lessonData.courseId);
      }
      
      if (lessonData.order !== undefined) {
        formData.append('order', lessonData.order.toString());
      }
      
      if (lessonData.isFree !== undefined) {
        formData.append('isFree', lessonData.isFree.toString());
      }
      
      if (lessonData.status) {
        formData.append('status', lessonData.status);
      }
      
      if (lessonData.transcript) {
        formData.append('transcript', lessonData.transcript);
      }
      
      if (lessonData.video) {
        formData.append('video', lessonData.video);
      }
      
      if (lessonData.image) {
        formData.append('image', lessonData.image);
      }

      const response = await apiClient.put<Lesson>(`/lesson/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating lesson ${id}:`, error);
      throw new Error('Dərsi yeniləmək mümkün olmadı');
    }
  },

  async deleteLesson(id: string): Promise<void> {
    try {
      await apiClient.delete(`/lesson/${id}`);
    } catch (error) {
      console.error(`Error deleting lesson ${id}:`, error);
      throw new Error('Dərsi silmək mümkün olmadı');
    }
  },
  
  async markLessonAsWatched(lessonId: string, watchedSeconds: number): Promise<void> {
    try {
      await apiClient.post(`/lesson/${lessonId}/watch`, { watchedSeconds });
    } catch (error) {
      console.error(`Error marking lesson ${lessonId} as watched:`, error);
      throw new Error('Dərsi izlənilmiş kimi qeyd etmək mümkün olmadı');
    }
  },
  
  async getLessonProgress(userId: string, lessonId: string): Promise<LessonProgress> {
    try {
      const response = await apiClient.get<LessonProgress>(`/lesson/${lessonId}/progress/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId} progress:`, error);
      throw new Error('Dərslərin irəliləyişini yükləmək mümkün olmadı');
    }
  }
};

export const { 
  getLessons, 
  getLessonsByCourse, 
  getLesson, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  markLessonAsWatched,
  getLessonProgress 
} = lessonService; 