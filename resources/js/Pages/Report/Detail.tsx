import Alert from '@/Components/Alert';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';

interface Report {
    id: number;
    user_id: number;
    examiner_id: number;
    study_subject_id: number;
    sub_study_subject_id: number;
    study_subject: string;
    sub_study_subject: string;
    attachment: string;
    point: number;
    sub_point: number;
    status: StatusReport;

}

enum StatusReport {
    Waiting = '0',
    Approved = '1',
    Rejected = '2',
}


const TableStudentDetail = ({ reports }: { reports: Partial<Report[]> }) => {
    const onChangeStatus = (report: Report, value: StatusReport) => {
        const payload = {
            id: report?.id,
            // user_id: report?.user_id,
            // study_subject_id: report?.study_subject_id,
            // examiner_id: report?.examiner_id,
            status: value,
        }

        console.log(payload)
        router.put(`/dashboard/student-report/${report?.user_id}`, payload)
    }
    return (
        <table className="w-full mt-4 border">
            <thead className='border bg-slate-700 text-white'>
                <tr>
                    <th className="text-center p-2">No</th>
                    <th className="text-center p-2">Kegiatan</th>
                    <th className="text-center p-2">Nilai</th>
                    <th className="text-center p-2">Attachment</th>
                    <th className="text-center p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {reports ? reports.map((report: any, i: number) => {
                    const filePath = report.attachment;
                    const updatedPath = filePath.replace("documents/", "");

                    return (
                        <tr key={report.study_subject + '-' + i}>
                            <td className="text-center p-2">{i + 1}</td>
                            <td className="text-left p-2"><b>{report?.study_subject}</b> : {report?.sub_study_subject}</td>
                            <td className="text-center p-2">{report?.point > 0 ? report?.point : report?.sub_point}</td>
                            <td className="text-center p-2">
                                {report?.attachment ? (
                                    <a href={`/storage/documents/${updatedPath}`} target='_blank'>Lihat Attachment</a>
                                ) : 'No attachment'}
                            </td>
                            <td className="text-center p-2 flex justify-center items-center gap-4">
                                <select onChange={(e) => {
                                    e.preventDefault()
                                    const value: StatusReport = e?.target?.value as StatusReport
                                    onChangeStatus(report, value)
                                }} id={report.study_subject + '-' + i}>
                                    <option selected={report?.status === StatusReport.Waiting} value={StatusReport.Waiting}>Menunggu</option>
                                    <option selected={report?.status === StatusReport.Approved} value={StatusReport.Approved}>Disetujui</option>
                                    <option selected={report?.status === StatusReport.Rejected} value={StatusReport.Rejected}>Ditolak</option>
                                </select>
                            </td>
                        </tr>
                    )
                }) : 'No data'}
            </tbody>
        </table>
    )
}

export default function ReportDetail({ reports }: { reports: Partial<Report[]> }) {
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = useState(false);

    const user = usePage().props.auth.user;
    const isEditAuthorized = user?.status > 1 // Student or Lecturer
    const [payloadReport, setPayloadReport] = useState(reports || []);

    useEffect(() => {
        // Update payloadReport if reports prop changes
        setPayloadReport(reports || []);
    }, [reports]);

    useEffect(() => {
        if (flash.success || flash.error) {
            setShowAlert(true);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {showAlert && (
                        <Alert type={flash.error ? 'error' : 'success'} message={flash.success ?? flash.error} onClose={() => {
                            setShowAlert(false)
                        }} />
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <TableStudentDetail reports={reports} />

                            {/* <PrimaryButton className='mt-8' type="button" onClick={(e) => { }}>Simpan</PrimaryButton> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
