## SKP Web

### Table users
id | name                | email                       | password | phone_number | identification_number | status  |
1  | fujianto            | cuteo@gmail.com          | -zz      | 085717906500 | 1400586977            | 1       |
3  | Elvi Khairunnisa    | elivi@xmail.com  | ad       | 080917864322 | 100073630434          | 2      |
4  | Game Master         | admin@xaisinpo.com          | ad       | 080917864322 | 110073630434          | 3       |

### Table study_subjects
id | name          | description      | point | 
31 | Physics       | brainiac         | 0     | 
32 | Sports        | sporty           | 20    |   
33 | Kimia         |                  | 0     |   

### Table sub_study_subjects
id | name         | study_subject_id | description       | point | 
49 | Advance      |        31        | brainiac  2       | 40    | 
50 | Beginner     |        31        | sporty   1        | 10    |   
51 | Teori        |        33        | sporty   1        | 10    |   
52 | Terapan      |        33        | sporty   1        | 10    |   

### Table reports
id | user_id    | study_subject_id       | sub_study_subject_id | status | attachment | examiner_id |
1 | 4           | 31                     | 49                   |  0     |   doc.pdf  |  2          |
2 | 1           | 33                     | 52                   |  1     | mine.pdf   |   2         |
3 | 1           | 32                     | null                 |  1     | bio.pdf    |     2       |


### results
user_id      |  user_name    | identification_number | examiner_name    |
4       | Game Master   | 110073630434          | Elvi Khairunnisa |
1       | fujianto      | 1400586977            | Elvi Khairunnisa |


user_id |  user_name    | study_subject | sub_study_subject | point | sub_point | status     | attachment    |
1       |  fujianto     | Sports        |                   |  20   |           |   1        |   mine.pdf    |
1       |  fujianto     | Physics       | Advance           |       |  40       |   1        |   mine.pdf    | 

id      |  user_name    | identification_number | study_subject | sub_study_subject | point | sub_point | status     | attachment    | examiner_name    |
1       | Game Master   | 110073630434          | Physics       | Advance           | 0     |  31       | 0          | doc.pdf       | Elvi Khairunnisa |
1       | fujianto      | 1400586977            | Kimia         | Advance           | 0     |  31       | 1          | mine.pdf      | Elvi Khairunnisa |
1       | fujianto      | 1400586977            | Sports        |                   | 20    |  0        | 1          | bio.pdf       | Elvi Khairunnisa |

SELECT 
    r.id AS report_id,
    u.name AS user_name,
    u.identification_number,
    ss.name AS study_subject,
    sss.name AS sub_study_subject,
    ss.point AS point,
    sss.point AS sub_point,
    r.status,
    r.attachment,
    e.name AS examiner_name
FROM 
    reports r
JOIN 
    users u ON r.user_id = u.id
JOIN 
    study_subjects ss ON r.study_subject_id = ss.id
LEFT JOIN 
    sub_study_subjects sss ON r.sub_study_subject_id = sss.id
JOIN 
    users e ON r.examiner_id = e.id
WHERE 
    r.examiner_id = 3;


### Table study_subjects
id | name          | description      | point | 
31 | Physics       | brainiac         | 0     | 
32 | Sports        | sporty           | 20    |   
33 | Kimia         |                  | 0     |   

### Table sub_study_subjects
id | name         | study_subject_id | description       | point | 
49 | Advance      |        31        | brainiac  2       | 40    | 
50 | Beginner     |        31        | sporty   1        | 10    |   
51 | Teori        |        33        | sporty   1        | 10    |   
52 | Terapan      |        33        | sporty   1        | 10    |   

[
   {
     study_subjects_id: 31,
     study_subjects_name: 'Physics',
     description: 'brainiac',
     point: 0,
     sub_study_subjects: [
        {
            sub_study_subjects_id: 49,
            sub_study_subjects_name: 'Advance',
            description: 'brainiac 2',
            point: 40,
        },
         {
            sub_study_subjects_id: 50,
            sub_study_subjects_name: 'Beginner',
            description: 'sporty 1',
            point: 10,
        }
     ]
   },
   {
     study_subjects_id: 33,
     study_subjects_name: 'Sports',
     description: 'sporty',
     point: 20,
     sub_study_subjects: []
   },
   {
     study_subjects_id: 31,
     study_subjects_name: 'Kimia',
     description: 'brainiac',
     point: 0,
     sub_study_subjects: [
        {
            sub_study_subjects_id: 51,
            sub_study_subjects_name: 'Teori',
            description: 'sporty   1',
            point: 10,
        },
         {
            sub_study_subjects_id: 52,
            sub_study_subjects_name: 'Terapan',
            description: 'sporty 1',
            point: 10,
        }
     ]
   },
]
