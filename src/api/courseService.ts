import apiClient from './apiClient';
import { SubjectType } from '../types/enums';

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: SubjectType;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseData {
  title: string;
  description: string;
  subject: SubjectType;
  image?: File;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  subject?: SubjectType;
  image?: File;
}

export const courseService = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>('/course');
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw new Error('Kursları yükləmək mümkün olmadı');
    }
  },

  async getCourse(id: string): Promise<Course> {
    try {
      const response = await apiClient.get<Course>(`/course/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error);
      throw new Error('Kursu yükləmək mümkün olmadı');
    }
  },

  async createCourse(courseData: CreateCourseData): Promise<Course> {
    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('subject', courseData.subject.toString());
      
      if (courseData.image) {
        formData.append('image', courseData.image);
      }

      const response = await apiClient.post<Course>('/course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Kursu yaratmaq mümkün olmadı');
    }
  },

  async updateCourse(id: string, courseData: UpdateCourseData): Promise<Course> {
    try {
      const formData = new FormData();
      
      if (courseData.title) {
        formData.append('title', courseData.title);
      }
      
      if (courseData.description) {
        formData.append('description', courseData.description);
      }
      
      if (courseData.subject) {
        formData.append('subject', courseData.subject.toString());
      }
      
      if (courseData.image) {
        formData.append('image', courseData.image);
      }

      const response = await apiClient.put<Course>(`/course/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating course ${id}:`, error);
      throw new Error('Kursu yeniləmək mümkün olmadı');
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      await apiClient.delete(`/course/${id}`);
    } catch (error) {
      console.error(`Error deleting course ${id}:`, error);
      throw new Error('Kursu silmək mümkün olmadı');
    }
  }
};

export const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = courseService; 