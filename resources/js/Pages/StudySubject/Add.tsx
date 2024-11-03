import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, TStudySubject } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import StudySubjectForm from './Partials/StudySubjectForm';

export default function Add({ errors, studySubject, id }: PageProps<{ errors: any; studySubject: TStudySubject, id?: number | string | null }>) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Tambah Kegiatan
                </h2>
            }
        >
            <Head title="Tambah Kegiatan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                        <StudySubjectForm
                            className="space-y-6"
                            // errors={errors}
                            auth={usePage().props.auth}
                            ziggy={usePage().props.ziggy}
                            studySubjectId={id}
                            studySubject={studySubject}
                        />
                    </div>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
