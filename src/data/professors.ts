/**
 * Static Professor Data
 * Simple mock records — no fetching, no filtering
 */

import { Professor } from '@/types';

export const DEPARTMENTS: { id: string; name: string }[] = [
    { id: '1', name: 'Computer Science' },
    { id: '2', name: 'Engineering' },
    { id: '3', name: 'Business Administration' },
];

// export const professors: Professor[] = [
//     {
//         id: 'prof_1',
//         userName: 'prof_smith',
//         email: 'prof.smith@university.edu',
//         password: 'ProfPass123!',
//         phoneNumber: '5001234567',
//         fullName: 'Dr. Robert Smith',
//         nationalId: 'NAT-500001',
//         departmentId: '1',
//         specialization: 'Machine Learning',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
//     {
//         id: 'prof_2',
//         userName: 'prof_johnson',
//         email: 'prof.johnson@university.edu',
//         password: 'ProfPass456!',
//         phoneNumber: '5001234568',
//         fullName: 'Dr. Emily Johnson',
//         nationalId: 'NAT-500002',
//         departmentId: '2',
//         specialization: 'Structural Engineering',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
//     {
//         id: 'prof_3',
//         userName: 'prof_williams',
//         email: 'prof.williams@university.edu',
//         password: 'ProfPass789!',
//         phoneNumber: '5001234569',
//         fullName: 'Prof. James Williams',
//         nationalId: 'NAT-500003',
//         departmentId: '3',
//         specialization: 'Finance',
//         createdAt: new Date('2024-01-01'),
//         updatedAt: new Date('2024-01-01'),
//     },
// ];
