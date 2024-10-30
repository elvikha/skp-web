import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { TSubStudySubject } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import Alert from '@/Components/Alert';
import React from 'react';

export default function StudySubject({ studySubjects }: { studySubjects: TSubStudySubject[] }) {
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = React.useState(flash.success);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Study Subject
                </h2>
            }
        >
            <Head title="StudySubject" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {showAlert && (
                        <Alert type='success' message={flash.success} onClose={() => {
                            setShowAlert(false)
                        }} />
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <PrimaryButton type="button" onClick={(e) => {
                                router.visit('/dashboard/study-subject/add')
                            }}>+ Tambah</PrimaryButton>

                            <table className="w-full mt-4 border">
                                <thead className='border'>
                                    <tr>
                                        <th className="text-center">ID</th>
                                        <th className="text-center">Name</th>
                                        <th className="text-center">Point</th>
                                        <th className="text-center">Description</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studySubjects && studySubjects.map((studySubject: TSubStudySubject) => (
                                        <tr className='border' key={studySubject.id}>
                                            <td className="text-center">{studySubject.id}</td>
                                            <td className="text-left">
                                                <b>{studySubject.name}</b>
                                                <ul className='pl-6'>
                                                    {studySubject.sub_study_subjects && studySubject.sub_study_subjects.map((subStudySubject: TSubStudySubject) => {
                                                        return (

                                                            <li className='list-disc' key={subStudySubject.id}>{subStudySubject.name}</li>
                                                        );
                                                    })}
                                                </ul>


                                            </td>
                                            <td className="text-center pt-5">{studySubject.point > 0 ? studySubject.point : ''}

                                                {studySubject.sub_study_subjects && studySubject.sub_study_subjects.map((subStudySubject: TSubStudySubject) => {
                                                    return (
                                                        <div key={subStudySubject.id}>
                                                            <span className="text-center">{subStudySubject.point}</span>
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td className="text-center">{studySubject.description}</td>

                                            <td className="text-center flex items-center justify-center gap-3 h-28">
                                                <button className="bg-transparent cursor-pointer" type="button" onClick={(e) => {
                                                    router.visit(`/dashboard/study-subject/edit/${studySubject.id}`)
                                                }}>Edit</button>

                                                <button className="bg-transparent cursor-pointer text-red-600" type="button" onClick={(e) => {
                                                    router.visit(`/dashboard/study-subject/delete/${studySubject.id}`)
                                                }}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}
