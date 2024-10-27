import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextAreaInput from '@/Components/TextAreaInput';
import TextInput from '@/Components/TextInput';
import { PageProps } from '@/types';
import { Transition } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

export default function StudySubjectForm(
    { className = '', errors }: PageProps<{ className: string, errors?: any }>
) {
    const [values, setValues] = useState<{
        name: string;
        description: string;
        point: number;
        subStudySubjects: { name: string; description: string; point: number }[];
    }>({
        name: "",
        description: "",
        point: 0,
        subStudySubjects: [
            // { name: '', description: '', point: 0 },
            // { name: '', description: '', point: 0 },
        ],
    })

    const [processing, setProcessing] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;
        setValues(values => ({
            ...values,
            [id]: value,
        }));
    }

    const handleSubChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const key = e.target.name as keyof typeof values.subStudySubjects[0];
        const value = e.target.name === 'point' ? parseInt(e.target.value) : e.target.value;
        const subStudySubjects = [...values.subStudySubjects];
        subStudySubjects[index][key] = value as never;
        setValues(values => ({
            ...values,
            subStudySubjects
        }));
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        setProcessing(true)
        console.log(values)
        router.post('/dashboard/study-subject/add', values)
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

                {/* {JSON.stringify(values)} */}
            </header>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                    <InputLabel className="mt-2" htmlFor="name" value="Nama Judul" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={values.name} onChange={handleChange}
                        required
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
                        value={values.description}
                        onChange={handleChange}
                        required
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
                        value={values.point}
                        onChange={handleChange}
                        required
                        isFocused
                        autoComplete="off"
                    />

                    <InputError className="mt-2" message={errors.point} />
                </div>

                <div className="flex flex-col items-end gap-4 mt-4">
                    <PrimaryButton type="button" onClick={(e) => {
                        e.preventDefault();
                        setValues(values => ({
                            ...values,
                            subStudySubjects: [
                                ...values.subStudySubjects,
                                { name: '', description: '', point: 0 }
                            ]
                        }));
                    }}>+ Tambah Sub kegiatan</PrimaryButton>
                </div>

                {values.subStudySubjects.length > 0 && (
                    <>
                        {values.subStudySubjects.map((item, index) => {
                            return (

                                <div key={index}>
                                    <div className="flex align-middle items-center justify-between">
                                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Sub Kegiatan
                                        </h2>

                                        <button className="text-red-600" onClick={(e) => {
                                            e.preventDefault()
                                            setValues(values => ({
                                                ...values,
                                                subStudySubjects: values.subStudySubjects.filter((_, i) => i !== index)
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
                                        required
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
                    </>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton type="submit" disabled={processing}>Save</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
