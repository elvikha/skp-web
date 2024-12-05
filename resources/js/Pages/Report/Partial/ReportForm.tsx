import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import SelectInput from "@/Components/SelectInput"
import TextInput from "@/Components/TextInput"
import { TReport, TStudySubject } from "@/types"
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { useEffect, useState } from "react"

export type MStudySubject = {
    study_subjects_id?: number | null | undefined,
    sub_study_subjects_id?: number | null | undefined,
    study_subjects_name: string
    sub_study_subjects_name?: string
    description: string
    point: number
    sub_study_subjects?: Partial<MStudySubject>[]
}

export default function ReportForm({
    // errors,
    className = '',
    user_id = null,
    examiner_id = 3,
    report_id = null,
    studySubjects = [],
    examiner = null,
}: {
    className?: string
    user_id?: number | null
    examiner_id?: number | null
    report_id?: number | null
    studySubjects?: MStudySubject[] | null
    examiner?: any | null
}) {
    type TFormInputID = "user_id" | "examiner_id" | "study_subject_id" | "sub_study_subject_id" | "status" | "attachment"
    enum StatusReport {
        Waiting = '0',
        Approved = '1',
        Rejected = '2',
    }

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm<TReport[]>([
            {
                user_id: user_id || null,
                study_subject_id: null,
                sub_study_subject_id: null,
                status: StatusReport.Waiting,
                examiner_id: examiner_id || null,
                attachment: ""
            }
        ])


    // const handleSubStudySubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedId = Number(event.target.value)
    //     const selectedSubject = studySubjects?.find(subject => subject.study_subjects_id === selectedId) || null

    //     setSelectedStudySubject(selectedSubject)
    //     // setSelectedSubStudySubjects(selectedSubject?.sub_study_subjects)

    //     console.log(selectedSubject)
    // }

    // setSelectedSubStudySubjects(selectedStudySubject?.sub_study_subjects)


    const handleChange = (index: number, field: keyof TReport, value: any) => {
        const updatedData = [...data]
        console.log(data)
        updatedData[index][field] = value
        setData(updatedData)
    }

    const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const allowedFormats = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/zip', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 3 * 1024 * 1024; // 3MB

            if (!allowedFormats.includes(file.type)) {
                alert('Invalid file format. Only .pdf, .ppt, .zip, and .docx are allowed.');
                return;
            }

            if (file.size > maxSize) {
                alert('File size exceeds the maximum limit of 3MB.');
                return;
            }

            console.log(event.target.value.split('\\')[2])
            console.log(file)
            console.log("file ==>")

            if (event.target.files) {
                console.log(event.target.files[0]);
            }
            handleChange(index, 'attachment', file);
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const formData = new FormData();
        data.forEach((report, index) => {
            formData.append(`reports[${index}][user_id]`, report.user_id?.toString() || '');
            formData.append(`reports[${index}][study_subject_id]`, report.study_subject_id?.toString() || '');
            formData.append(`reports[${index}][sub_study_subject_id]`, report.sub_study_subject_id?.toString() || '');
            formData.append(`reports[${index}][status]`, report.status);
            formData.append(`reports[${index}][examiner_id]`, report.examiner_id?.toString() || '');

            if (report.attachment instanceof File) {
                formData.append(`reports[${index}][attachment]`, report.attachment);
            }
        });

        // Debugging: Log the formData entries
        // for (let pair of formData.entries()) {
        //     console.log(pair[0] + ': ' + pair[1]);
        // }

        // if (report_id === null) {
        //     post('/dashboard/reports/bulk-insert', formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        // } else {
        //     post(`/dashboard/report/edit/${report_id}`, formData, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
        // }

        if (report_id === null) {
            router.post('/dashboard/reports/bulk-insert', Object.fromEntries(formData))
            console.log('add here!!')

            // post('/dashboard/reports/bulk-insert', {
            //     preserveScroll: true,
            //     onSuccess: () => console.log('Success'),
            //     onError: () => console.log('Error'),
            //     data: Object.fromEntries(formData),
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <header>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Kegiatan</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Tambah Kegiatan</p>
                    {/* <img src="/documents/logo.png" alt="ada" /> */}
                </header>

                <div className="form-contain !mt-0 flex flex-col">
                    {data.map((report, index) => {
                        const optionsSubStudySubject = studySubjects && studySubjects
                            .find((subject) => subject.study_subjects_id === report.study_subject_id)
                            ?.sub_study_subjects
                            ?.filter((subSubject) => subSubject.sub_study_subjects_id !== null && subSubject.sub_study_subjects_id !== undefined && subSubject.sub_study_subjects_name !== undefined)
                            .map((subSubject) => ({
                                id: subSubject.sub_study_subjects_id as number,
                                name: subSubject.sub_study_subjects_name as string,
                            })) || []

                        return (
                            <>
                                <div key={index} className="space-y-4">
                                    <div>
                                        <header className="mt-6">
                                            <div className="flex align-middle items-center justify-between">
                                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Kegiatan {index + 1}</h2>

                                                {data && data.length > 1 ? (
                                                    <button onClick={(e) => {
                                                        e.preventDefault()
                                                        setData(data.filter((_, i) => i !== index))
                                                    }} className="text-red-600">Hapus</button>
                                                ) : null}
                                            </div>
                                        </header>

                                        <label htmlFor={`study_subject_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Kegiatan
                                        </label>
                                        <SelectInput
                                            id={`study_subject_${index}`}
                                            name={`study_subject_${index}`}
                                            default_select_text="Pilih kegiatan"
                                            options={(studySubjects || [])
                                                .filter(studySubject => studySubject.study_subjects_id !== null && studySubject.study_subjects_id !== undefined)
                                                .map((studySubject) => ({
                                                    id: studySubject.study_subjects_id as number,
                                                    name: studySubject.study_subjects_name,
                                                    point: studySubject.point,
                                                }))}
                                            value={report.study_subject_id?.toString() || ''}
                                            onChange={(e) => handleChange(index, 'study_subject_id', parseInt(e.target.value))}
                                            renderOption={(option) => (
                                                <option key={option.id} value={option.id}>
                                                    {option.name}
                                                </option>
                                            )}
                                        />
                                    </div>
                                    {optionsSubStudySubject.length > 0 ? (
                                        <div>
                                            <label htmlFor={`sub_study_subject_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Sub Kegiatan
                                            </label>
                                            <SelectInput
                                                id={`sub_study_subject_${index}`}
                                                name={`sub_study_subject_${index}`}
                                                options={optionsSubStudySubject}
                                                 default_select_text="Pilih Sub kegiatan"
                                                value={report.sub_study_subject_id?.toString() || ''}
                                                onChange={(e) => handleChange(index, 'sub_study_subject_id', parseInt(e.target.value))}
                                                renderOption={(option) => (
                                                    <option key={option.id} value={option.id}>
                                                        {option.name}
                                                    </option>
                                                )}
                                            />
                                        </div>
                                    ) : null}


                                    <div>
                                        <label htmlFor={`attachment_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Attachment
                                        </label>
                                        {/* <input
                                        type="text"
                                        id={`attachment_${index}`}
                                        name={`attachment_${index}`}
                                        value={report.attachment}
                                        onChange={(e) => handleChange(index, 'attachment', e.target.value)}
                                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
                                    /> */}

                                        <input
                                            type="file"
                                            id={`attachment_${index}`}
                                            name={`attachment_${index}`}
                                            accept=".pdf,.ppt,.zip,.docx"
                                            onChange={(e) => handleFileChange(index, e)}
                                            className="attachment-uploader"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor={`examiner_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Dosen Pembimbing
                                        </label>
                                        <select
                                            id={`examiner_${index}`}
                                            name={`examiner_${index}`}
                                            value={report.examiner_id?.toString() || ''}
                                            onChange={(e) => handleChange(index, 'status', e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
                                        >
                                            <option value={3}>Elvi Khairunnisa, M.Si.</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor={`status_${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Status
                                        </label>
                                        <select
                                            id={`status_${index}`}
                                            name={`status_${index}`}
                                            value={report.status}
                                            onChange={(e) => handleChange(index, 'status', e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600 mt-1 block w-full"
                                        >
                                            <option value={StatusReport.Waiting}>Menunggu</option>
                                            {/* <option value={StatusReport.Approved}>Approved</option> */}
                                            {/* <option value={StatusReport.Rejected}>Rejected</option> */}
                                        </select>
                                    </div>
                                </div>
                                <hr className="mt-7" />
                            </>
                        )
                    })}
                </div>

                <div className="flex items-center justify-between gap-2">
                    <PrimaryButton onClick={(e) => {
                        e.preventDefault()
                        setData([...data, {
                            user_id: user_id || null,
                            study_subject_id: null,
                            sub_study_subject_id: null,
                            status: StatusReport.Waiting,
                            examiner_id: examiner_id || null,
                            attachment: ""
                        }])
                    }}>+Tambah Kegiatan</PrimaryButton>

                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                    >
                        {processing ? 'Processing...' : 'Kirim'}
                    </PrimaryButton>
                </div>
            </form>
        </>
    )
}