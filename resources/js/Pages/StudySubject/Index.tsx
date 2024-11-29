import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { TStudySubject, TSubStudySubject } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import Alert from '@/Components/Alert';
import React, { useState } from 'react';

export default function StudySubject({ studySubjects, search = '' }: { studySubjects: TSubStudySubject[], search: string }) {
  const { flash } = usePage().props;
  const [showAlert, setShowAlert] = useState(flash.success);

  const { data, setData, get } = useForm({ search: search ?? '' });
  const [searchResults, setSearchResults] = useState<TStudySubject[]>([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData('search', e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    get(route('studySubject.search'), {
      onSuccess: (page) => {
        setSearchResults(page.props.studySubjects as TStudySubject[]);
      },
    });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Kegiatan
        </h2>
      }
    >
      <Head title="Kegiatan" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {showAlert && (
            <Alert type='success' message={flash.success} onClose={() => {
              setShowAlert(false)
            }} />
          )}

          <form onSubmit={handleSearchSubmit} className="mb-6 flex justify-between items-center gap-2">
            <input
              type="text"
              value={data.search}
              onChange={handleSearchChange}
              placeholder="Cari kegiatan..."
              className="border p-2 rounded w-full"
            />
            {/* <button type="submit" className="p-2 bg-blue-500 text-white rounded">Search</button> */}
            <PrimaryButton type='submit' className="px-2 py-3">Cari</PrimaryButton>
          </form>

          {searchResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Search Results:</h3>
              <ul>
                {searchResults.map((subject) => (
                  <li key={subject.id}>{subject.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <PrimaryButton type="button" onClick={(e) => {
                router.visit('/dashboard/study-subject/add')
              }}>+ Tambah</PrimaryButton>

              <table className="w-full mt-4 border">
                <thead className='border bg-slate-700 text-white'>
                  <tr>
                    <th className="text-center p-2">No</th>
                    <th className="text-center p-2">Nama</th>
                    <th className="text-center p-2">Nilai</th>
                    <th className="text-center p-2">Deskripsi</th>
                    <th className="text-center p-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {studySubjects && studySubjects.map((studySubject: TSubStudySubject, index) => (
                    <tr className='border' key={studySubject.id}>
                      <td className="text-center">{index + 1}</td>
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
                      <td className="text-center text-xs w-[30%]">{studySubject.description}</td>

                      <td className="text-center flex items-center justify-center gap-3 h-28">
                        <button className="bg-transparent cursor-pointer text-blue-500" type="button" onClick={(e) => {
                          router.visit(`/dashboard/study-subject/edit/${studySubject.id}`)
                        }}>Ubah</button>

                        <button className="bg-transparent cursor-pointer text-red-600" type="button" onClick={(e) => {
                          router.visit(`/dashboard/study-subject/delete/${studySubject.id}`)
                        }}>Hapus</button>
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
