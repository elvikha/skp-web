import Alert from '@/Components/Alert';
import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';
import './style.css'

interface Report {
    study_subject: string;
    sub_study_subject: string;
    point: number;
    sub_point: number;
    status: string;
}

const getStatus = (status: string) => {
    switch (status) {
        case '0':
            return 'Menunggu'
        case '1':
            return 'Disetujui'
        case '2':
            return 'Ditolak'
        default:
            return 'Menunggu'
    }
}

const PointCard = ({ className = '', totalPoint, requiredPassingPoint = 250 }: { className: string, totalPoint: number, requiredPassingPoint?: number }) => {
    function calculatePercentage(inputNumber: number, requiredNumber: number) {
        if (requiredNumber === 0) {
            return 0; // Prevent division by zero
        }
        return Math.floor((inputNumber / requiredNumber) * 100);
    }

    function isPassingSKP(inputNumber: number, requiredNumber: number) {
        if (inputNumber < requiredNumber) {
            return false;
        }

        return true;
    }

    function getSKPCardStyling(inputNumber: number, requiredNumber: number) {
        if (inputNumber < 200) {
            return 'card-red';
        } else if (+inputNumber === +requiredNumber) {
            return 'card-green';
        } else if (inputNumber => 200 && inputNumber < 249) {
            return 'card-yellow';
        }
    }

    return (
        <div className={`point_card ${className} ${getSKPCardStyling(totalPoint, requiredPassingPoint)}`}>
            <h2 className="title">{isPassingSKP(totalPoint, requiredPassingPoint) ? 'Boleh Sidang' : 'Tidak Boleh Sidang'}</h2>
            <h2 className="subtitle">{calculatePercentage(totalPoint, requiredPassingPoint)}%</h2>
            <h3 className="point">Poin SKP: {totalPoint} / {requiredPassingPoint}</h3>
        </div>
    )
}

const TableStudent = ({ reports }: { reports: Partial<Report[]> }) => {
    const totalPoint = reports.reduce((sum, report) => {
        if (report && report.status === '1') {
            return sum + (report.point > 0 ? report.point : report.sub_point);
        }
        return sum;
    }, 0);

    return (
        <>
            <PointCard className='mb-5' totalPoint={totalPoint} requiredPassingPoint={250} />
            <PrimaryButton type="button" onClick={(e) => {
                router.visit('/dashboard/report/add')
            }}>+ Lapor Kegiatan</PrimaryButton>
            <table className="w-full my-4 border">
                <thead className='border bg-slate-700 text-white'>
                    <tr>
                        <th className="text-center p-2">No</th>
                        <th className="text-center p-2">Kegiatan</th>
                        <th className="text-center p-2">Point</th>
                        <th className="text-center p-2">Status</th>
                        <th className="text-center p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports ? reports.map((report: any, i: number) => {
                        return (
                            <tr key={report.study_subject + '-' + i}>
                                <td className="text-center p-2">{i + 1}</td>
                                <td className="p-2"><b>{report.study_subject}</b> {report.sub_study_subject ? ": " + report.sub_study_subject : ''}</td>
                                <td className="text-center p-2">{+report.point > 0 ? report.point : report.sub_point}</td>
                                <td className={`text-center p-2 ${report.status === '0' ? 'text-yellow-600' : ''}  ${report.status === '1' ? 'text-green-600' : ''} ${report.status === '2' ? 'text-red-600' : ''}`}>{getStatus(report.status)}</td>
                                <td className="text-center p-2 flex justify-center items-center gap-4">
                                    <button className="bg-transparent cursor-pointer text-red-600" type="button" onClick={(e) => {
                                        router.visit(`/dashboard/report/delete/${report?.id}`)
                                    }}>Delete</button>
                                </td>
                            </tr>
                        )
                    }) : 'No data'}
                </tbody>
            </table>
            <div className="flex justify-end">
                <h3>Total Point: {totalPoint}</h3>
            </div>
        </>
    )
}

const TableExaminer = ({ reports }: { reports: Partial<Report[]> }) => {
    return (
        <table className="w-full mt-4 border">
            <thead className='border bg-slate-700 text-white'>
                <tr>
                    <th className="text-center p-2">No</th>
                    <th className="text-center p-2">Nama Mahasiswa</th>
                    <th className="text-center p-2">NIM</th>
                    <th className="text-center p-2">Action</th>
                </tr>
            </thead>
            <tbody>
                {reports ? reports.map((report: any, i: number) => {
                    return (
                        <tr key={report.study_subject + '-' + i}>
                            <td className="text-center p-2">{i + 1}</td>
                            <td className="text-center p-2">{report?.user_name}</td>
                            <td className="text-center p-2">{report?.identification_number}</td>
                            <td className="text-center p-2 flex justify-center items-center gap-4">
                                <button className="bg-transparent cursor-pointer text-blue-500" type="button" onClick={(e) => {
                                    router.visit(`/dashboard/student-report/${report?.user_id}`)
                                }}>Periksa</button>
                            </td>
                        </tr>
                    )
                }) : 'No data'}
            </tbody>
        </table>
    )
}

export default function Dashboard({ reports }) {
    const { flash } = usePage().props;
    const [showAlert, setShowAlert] = useState(flash.error || flash.success);
    const user = usePage().props.auth.user;
    const isEditAuthorized = user?.status > 1 // Student or Lecturer

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
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        {showAlert && (
                            <Alert type={flash.error ? 'error' : 'success'} message={flash.error || flash.success} onClose={() => {
                                setShowAlert(false)
                            }} />
                        )}
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* {JSON.stringify(reports)} */}
                            <h2 className='font-bold text-3xl mb-8'>Selamat Datang, <i>{user?.name}</i></h2>

                            {isEditAuthorized ? <TableExaminer reports={reports} /> : <TableStudent reports={reports} />}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
