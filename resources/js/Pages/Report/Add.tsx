import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import ReportForm, { MStudySubject } from './Partial/ReportForm';
import { useEffect, useState } from 'react';
import Alert from '@/Components/Alert';

export default function Add({ errors, studySubjects, id, examiner }: PageProps<{ errors: any; studySubjects: MStudySubject[], examiner: any, id?: number | string | null }>) {
    const user = usePage().props.auth.user;
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = useState(flash.error !== null || JSON.stringify(errors).length > 2 ? true : false);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            setShowAlert(true);
        } else {
            setShowAlert(false);
        }
    }, [errors]);


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
                        {showAlert && (
                            <>
                                {Object.keys(errors).map((key) => {
                                    return (
                                        <Alert key={key} type='error' message={errors[key]} onClose={() => {
                                            setShowAlert(false)
                                        }} />
                                    )
                                })}

                                {/* <Alert type={flash.error !== null || JSON.stringify(errors).length > 2 ? 'error' : 'success'} message={flash.error ? flash.error : JSON.stringify(errors) || flash.success} onClose={() => {
                                    setShowAlert(false)
                                }} /> */}
                            </>
                        )}
                        <ReportForm
                            className="space-y-6" user_id={user?.id} studySubjects={studySubjects} examiner={examiner}                        // 
                        />
                    </div>
                </div>
            </div >
        </AuthenticatedLayout >
    );
}
