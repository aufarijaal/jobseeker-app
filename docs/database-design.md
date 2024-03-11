# Job Seeker App Database Design

1. **Users Table:**

   | Column      | Data Type   | Constraints |
   | ----------- | ----------- | ----------- |
   | id          | Primary Key |             |
   | first_name  | VARCHAR     |             |
   | middle_name | VARCHAR     |             |
   | last_name   | VARCHAR     |             |
   | full_name   | VARCHAR     |             |
   | email       | VARCHAR     | Unique      |
   | password    | VARCHAR     |             |
   | created_at  | TIMESTAMP   |             |

2. **Employers Table:**

   | Column     | Data Type   | Constraints          |
   | ---------- | ----------- | -------------------- |
   | id         | Primary Key |                      |
   | user_id    | Foreign Key | References Users     |
   | company_id | Foreign Key | References Companies |

3. **Jobs Table:**

   | Column       | Data Type   | Constraints          |
   | ------------ | ----------- | -------------------- |
   | id           | Primary Key |                      |
   | employer_id  | Foreign Key | References Employers |
   | company_id   | Foreign Key | References Companies |
   | title        | VARCHAR     |                      |
   | description  | TEXT        |                      |
   | requirements | TEXT        |                      |
   | salary       | DECIMAL     |                      |
   | location     | VARCHAR     |                      |
   | created_at   | TIMESTAMP   |                      |

4. **Companies Table:**

   | Column   | Data Type   | Constraints |
   | -------- | ----------- | ----------- |
   | id       | Primary Key |             |
   | name     | VARCHAR     |             |
   | location | VARCHAR     |             |
   | about    | TEXT        |             |
   | industry | VARCHAR     |             |

5. **Applications Table:**

   | Column        | Data Type   | Constraints      |
   | ------------- | ----------- | ---------------- |
   | id            | Primary Key |                  |
   | job_seeker_id | Foreign Key | References Users |
   | job_id        | Foreign Key | References Jobs  |
   | app_date      | TIMESTAMP   |                  |
   | status        | VARCHAR     |                  |

6. **Experiences Table:**

   | Column       | Data Type   | Constraints      |
   | ------------ | ----------- | ---------------- |
   | id           | Primary Key |                  |
   | user_id      | Foreign Key | References Users |
   | title        | VARCHAR     |                  |
   | company_name | VARCHAR     |                  |
   | start_date   | DATE        |                  |
   | end_date     | DATE        | Nullable         |
   | description  | TEXT        |                  |

7. **Job Categories Table:**

   | Column | Data Type   | Constraints |
   | ------ | ----------- | ----------- |
   | id     | Primary Key |             |
   | name   | VARCHAR     |             |
   | slug   | VARCHAR     |             |

8. **Educations Table:**

   | Column          | Data Type   | Constraints      |
   | --------------- | ----------- | ---------------- |
   | id              | Primary Key |                  |
   | user_id         | Foreign Key | References Users |
   | degree          | VARCHAR     |                  |
   | school          | VARCHAR     |                  |
   | graduation_date | DATE        | Nullable         |

9. **Skills Table:**

   | Column  | Data Type   | Constraints      |
   | ------- | ----------- | ---------------- |
   | id      | Primary Key |                  |
   | user_id | Foreign Key | References Users |
   | name    | VARCHAR     |                  |
