import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextAreaInput from '@/Components/TextAreaInput';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { TStudySubject, TSubStudySubject, PageProps } from '@/types';

export default function StudySubjectForm(
    {
        className = '',
        // errors,
        studySubjectId = null,
        studySubject
    }: PageProps<{
        className: string,
        // errors?: any,
        studySubjectId?: number | string | null,
        studySubject?: TStudySubject
    }>
) {
    type TFormInputID = "name" | "description" | "point" | "sub_study_subjects";

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm<Partial<TStudySubject>>({
            name: studySubject?.name || "",
            description: studySubject?.description || "",
            point: studySubject?.point || 0,
            sub_study_subjects: studySubject?.sub_study_subjects?.map(item => ({
                id: item.id,
                study_subject_id: item.study_subject_id,
                name: item.name,
                description: item.description,
                point: item.point
            })) || []
        })


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = e.target; e.target.id
        setData(id as TFormInputID, value);
    }

    const handleSubChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.name as keyof TSubStudySubject;
        const value = e.target.name === 'point' ? parseInt(e.target.value) : e.target.value;
        const sub_study_subjects: TSubStudySubject[] = data.sub_study_subjects ? [...data.sub_study_subjects] : [] as TSubStudySubject[];
        (sub_study_subjects[index] as any)[key] = value;
        sub_study_subjects[index]['study_subject_id'] = studySubjectId !== null ? +studySubjectId : null;

        setData('sub_study_subjects', sub_study_subjects);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        // setProcessing(true)
        if (studySubjectId === null) {
            router.post('/dashboard/study-subject/add', data)
            console.log('add here!!')
            console.log(data)

        } else {
            router.post('/dashboard/study-subject/edit/' + studySubjectId, data)
            console.log('edit here!!')
            console.log(data)

        }
    }

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Kegiatan
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Tambah Kegiatan
                </p>
            </header>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                    <InputLabel className="mt-2" htmlFor="name" value="Nama Judul" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data?.name} onChange={handleChange}
                        // required
                        isFocused
                        autoComplete="off"
                    />

                    <InputError className="mt-2" message={errors?.name} />
                </div>

                <div>
                    <InputLabel className="mt-2" htmlFor="description" value="Deskripsi" />

                    <TextAreaInput
                        id="description"
                        className="mt-1 block w-full"
                        value={data?.description}
                        onChange={handleChange}
                        // required
                        isFocused
                        autoComplete="off"
                    />

                    <InputError className="mt-2" message={errors.description} />
                </div>


                <div>
                    <InputLabel className="mt-2" htmlFor="point" value="Nilai" />

                    <TextInput
                        id="point"
                        className="mt-1 block w-full"
                        value={data?.point}
                        onChange={handleChange}
                        // required
                        isFocused
                        autoComplete="off"
                    />

                    <InputError className="mt-2" message={errors.point} />
                </div>

                <div className="flex flex-col items-end gap-4 mt-4">
                    <PrimaryButton type="button" onClick={(e) => {
                        e.preventDefault();

                        setData(prev => ({
                            ...prev,
                            sub_study_subjects: [
                                ...(prev.sub_study_subjects || []), // Initialize as an empty array if undefined
                                { id: null, name: '', description: '', point: 0 }
                            ]
                        }));


                    }}>+ Tambah Sub kegiatan</PrimaryButton>
                </div>

                {data?.sub_study_subjects && data?.sub_study_subjects.length > 0 && (
                    <>
                        {data.sub_study_subjects.map((item: Partial<TStudySubject>, index: number) => {
                            return (
                                <div key={index}>
                                    <div className="flex align-middle items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Sub Kegiatan #{index + 1}
                                        </h2>

                                        <button className="text-red-600" onClick={(e) => {
                                            e.preventDefault()
                                            setData(prev => ({
                                                ...prev,
                                                sub_study_subjects: (prev.sub_study_subjects || []).filter((_, i) => i !== index)
                                            }))
                                        }}>Hapus</button>
                                    </div>

                                    <InputLabel className="mt-2" htmlFor={`sub-name-${index}`} value="Nama Sub Judul" />
                                    <TextInput
                                        id={`sub-name-${index}`}
                                        name="name"
                                        className="mt-1 block w-full"
                                        value={item.name}
                                        onChange={(e) => handleSubChange(index, e)}
                                        required
                                        autoComplete="off"
                                    />
                                    <InputLabel className="mt-2" htmlFor={`sub-description-${index}`} value="Deskripsi Sub Judul" />
                                    <TextAreaInput
                                        id={`sub-description-${index}`}
                                        name="description"
                                        className="mt-1 block w-full"
                                        value={item.description}
                                        onChange={(e) => handleSubChange(index, e)}
                                        // required
                                        autoComplete="off"
                                    />
                                    <InputLabel className="mt-2" htmlFor={`sub-point-${index}`} value="Nilai Sub Judul" />
                                    <TextInput
                                        id={`sub-point-${index}`}
                                        name="point"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={item.point}
                                        onChange={(e) => handleSubChange(index, e)}
                                        required
                                        autoComplete="off"
                                    />
                                </div>
                            )
                        })}

                        <hr className='mt-5' />
                    </>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={false}>Save</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
