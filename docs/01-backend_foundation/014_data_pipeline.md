---
sidebar_position: 4
title: Engineering an Automated Seeding Pipeline
---

# 1.4 Engineering the Data Pipeline: From CSV to Automated Seeding

With a scalable schema in place, the next challenge was to populate the database with the manually collected problem data. This led to the creation of an elegant, automated data pipeline that transformed a simple spreadsheet into the application's foundational dataset.

### From Spreadsheet to Structured JSON

The initial Excel sheet, while useful for collection, was not suitable for direct database import. To solve this, so used a **Python script with the Pandas library**. This script parsed the CSV file, intelligently handled rows containing topic headers versus problem data, and transformed the entire dataset into a structured JSON format, ready for ingestion by the backend.

Here’s a sample of the JSON structure produced:
```json
[
  {
    "topicName": "Basics",
    "lectureRange": "Lecture 1 to 8",
    "order": 1,
    "problems": [
      {
        "sequenceNumber": 1,
        "title": "Subtract the Product and Sum of Digits of an Integer",
        "leetcode": "https://leetcode.com/problems/subtract-the-product-and-sum-of-digits-of-an-integer/",
        "gfg": "",
        "code360": ""
      },
      /* more problems */
    ]
  },
  /* more topics */
]
```

<details>
<summary>This is the Python script I used to convert the CSV to structured JSON</summary>

```python
import pandas as pd
import json

# Load the CSV file
file_name = 'LoveCppDSA(problem links).csv'
df = pd.read_csv(file_name)

# Display the first few rows and column information to understand the structure
print("First 5 rows of the CSV:")
print(df.head())
print("\nColumn information:")
print(df.info())

# It seems the CSV has some unnamed columns and inconsistent headers.
# Let's try to read it again, possibly skipping initial rows or using a different delimiter if it's not truly comma-separated.
# Given the previous PDF output, the columns were S.No, Problem Name, Code360, Leetcode, GFG, with topics interspersed.
# The `df.info()` output will be crucial to understand column names.
# Based on the previous context, the CSV seems to be a tabular representation of the PDF content.
# I'll assume the columns are 'S.No', 'Problem Name', 'Code360', 'Leetcode', 'GFG'.
# The topic and lecture ranges are likely in rows where 'S.No' is NaN or a specific pattern.

# Let's inspect unique values in the first column to identify topic rows
print("\nUnique values in the first column (df.iloc[:, 0]):")
print(df.iloc[:, 0].unique())

# Also inspect the second column
print("\nUnique values in the second column (df.iloc[:, 1]):")
print(df.iloc[:, 1].unique())

# Let's inspect the original PDF structure more carefully from previous context for a robust parsing strategy.
# The PDF shows:
# "S.No", "Problem Name", "Code360", "Leetcode", "GFG"
# And then rows like:
# ,, "Basics (Lecture 1 to 8)"
# "1", "Subtract the Product and Sum of Digits of an Integer", "https://leetcode.com/problems/..."
# ,, "Arrays (Lecture 9, 10, 20, 21, 23)"

# This means some rows are topic headers, and some are problem data.
# The S.No column will often be empty for topic headers.
# Also, problem links can be in multiple columns and sometimes span across cells if the CSV conversion was not perfect.

# Let's load the CSV again with no header initially to inspect raw data.
df_raw = pd.read_csv(file_name, header=None)
print("\nRaw CSV data (first 10 rows):")
print(df_raw.head(10))

# Try to identify rows that are topic headers vs problem rows.
# Topic rows seem to have topic name in column index 1 or 2, and empty first column.
# Problem rows have a number in column index 0 (S.No)

# Let's define the column names we expect
COLUMNS = ['S.No', 'Problem Name', 'Code360', 'Leetcode', 'GFG']

# Initialize the list to store our structured data
structured_data = []
current_topic_section = None
topic_order = 0

# Iterate through each row of the raw DataFrame
for index, row in df_raw.iterrows():
    # Attempt to parse a topic header
    # A topic header typically has a NaN or empty string in the first column (S.No)
    # and some text in the second or third column that looks like "Topic (Lecture X to Y)"
    # Let's check for the pattern "Lecture X to Y" or "Lecture X, Y, Z"

    # Check if the second column contains 'Lecture'
    if isinstance(row[1], str) and 'Lecture' in row[1]:
        # This is likely a topic header row.
        # The topic name might be in a preceding row or column.
        # Given the PDF, the topic name like "Basics" or "Arrays" is often in the same row as "Lecture X to Y" but in a different 'cell' or combined.
        # Let's refine based on the raw data.
        # From the PDF, topic names are on lines that are like: `,,"Basics (Lecture 1 to 8)"` or `,,"Arrays (Lecture 9, 10, 20, 21, 23)"`
        # This means the topic name and lecture range are often combined in the second column (index 1) in the CSV.

        # Let's try to extract topicName and lectureRange from the relevant cell
        full_topic_string = str(row[1]).strip() # Assuming topic string is in the second column (index 1)

        # Example: "Basics (Lecture 1 to 8)"
        # We need to parse this.
        # Let's find the first '('
        if '(' in full_topic_string and ')' in full_topic_string:
            topic_name_part = full_topic_string.split('(')[0].strip()
            lecture_range_part = full_topic_string.split('(')[1].strip(')')

            # Increment topic order
            topic_order += 1

            # Create a new topic section
            current_topic_section = {
                "topicName": topic_name_part,
                "lectureRange": lecture_range_part,
                "order": topic_order,
                "problems": []
            }
            structured_data.append(current_topic_section)
        elif 'Lecture' in full_topic_string: # For cases like "Binary Search (Lecture 12 to 15)"
            # Example: "Binary Search (Lecture 12 to 15)"
            parts = full_topic_string.split('(', 1)
            if len(parts) > 1:
                topic_name_part = parts[0].strip()
                lecture_range_part = parts[1].strip(')')
            else: # If no parenthesis but contains "Lecture"
                topic_name_part = full_topic_string.replace("Lecture", "").strip() # Best guess
                lecture_range_part = full_topic_string # Keep as is, it's ambiguous

            topic_order += 1
            current_topic_section = {
                "topicName": topic_name_part,
                "lectureRange": lecture_range_part,
                "order": topic_order,
                "problems": []
            }
            structured_data.append(current_topic_section)

    # Attempt to parse a problem row
    # A problem row starts with a number in the first column (S.No)
    # Check if the first column can be converted to an integer
    try:
        s_no = int(float(str(row[0]).strip())) # Convert to float first to handle potential decimals from CSV parsing

        if current_topic_section is not None:
            problem_title = str(row[1]).strip() if pd.notna(row[1]) else ""
            leetcode_link = str(row[2]).strip() if pd.notna(row[2]) else ""
            gfg_link = str(row[3]).strip() if pd.notna(row[3]) else ""
            code360_link = str(row[4]).strip() if pd.notna(row[4]) else ""

            # Some problem links are combined or split across columns.
            # Let's try to combine all link-like columns if they are not part of problem title
            # and clean up extra newlines/spaces.

            # Reconstruct problem links, as the CSV parsing might have shifted them.
            # Given the original PDF structure, columns were "S.No", "Problem Name", "Code360", "Leetcode", "GFG"
            # It's possible that the columns got misaligned during CSV conversion or that there are multiple links per cell.
            # Let's try to map them carefully from the raw row.

            # Inspecting raw PDF again:
            # "S.No", "Problem Name", "Code360", "Leetcode", "GFG"
            # For problem 1: Leetcode link is in column 2 (0-indexed). Other columns empty.
            # For problem 6: GFG link is in column 2.
            # For problem 9: Code360 in column 2, GFG in column 3.
            # For problem 11: Code360 in column 2, Leetcode in column 3.
            # So the link columns are dynamic.

            # Let's collect all possible URLs from columns starting from index 2
            # And try to categorize them.

            problem_links = {
                "leetcode": "",
                "gfg": "",
                "code360": ""
            }

            # Check columns 2, 3, 4 for links
            for i in range(2, len(row)):
                cell_content = str(row[i]).strip().replace('\n', ' ').replace('\r', ' ')
                if "http" in cell_content:
                    # Split by space if multiple links exist in one cell
                    urls = [url.strip() for url in cell_content.split(' ') if "http" in url]
                    for url in urls:
                        if "leetcode.com" in url:
                            problem_links["leetcode"] = url
                        elif "geeksforgeeks.org" in url or "geekstorgeeks.org" in url: # Correcting typo from PDF
                            problem_links["gfg"] = url
                        elif "naukri.com/code360" in url:
                            problem_links["code360"] = url

            problem = {
                "sequenceNumber": s_no,
                "title": problem_title,
                "leetcode": problem_links["leetcode"],
                "gfg": problem_links["gfg"],
                "code360": problem_links["code360"]
            }
            current_topic_section["problems"].append(problem)
    except ValueError:
        # Not a problem row (S.No not an integer), could be empty row or another type of header,
        # which we handle by checking for 'Lecture' above.
        pass

# Save the structured data to a JSON file
output_json_file = 'playlistData.json'
with open(output_json_file, 'w', encoding='utf-8') as f:
    json.dump(structured_data, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully processed data and saved to {output_json_file}")
# Print a sample of the structured data to verify
print("\nSample of generated JSON data (first topic section):")
print(json.dumps(structured_data[0], indent=2, ensure_ascii=False))

# If there's a second topic, print it too for verification
if len(structured_data) > 1:
    print("\nSample of generated JSON data (second topic section):")
    print(json.dumps(structured_data[1], indent=2, ensure_ascii=False))


```
</details>

### The Automated, Idempotent Seeder

This process revealed a deeper insight: instead of a one-time manual import, a fully automated and **idempotent** seeding mechanism was needed. This system, encapsulated in a `checkAndSeedDb` function, runs every time the server starts. It first checks if the `Topic` and `Problem` collections are empty. **Only if they are**, it proceeds to populate the database from the JSON file.

> This approach ensures a consistent, clean, and reproducible development environment, a core principle of modern DevOps. It demonstrates an understanding that building a **reliable** project is as important as building a functional one.

### Technical Deep Dive: Key Learnings

During the implementation of the seeder, I navigated several key technical challenges that deepened my understanding of the Node.js and Mongoose ecosystems:

* **ES Modules and JSON Imports:** The project's ES Module-based backend initially presented a challenge for importing the JSON data file. After researching the evolving ECMAScript standards, I learned that the older `assert` keyword for import assertions had been updated to the new, standard `with` keyword, allowing for the correct and modern way to import JSON modules.
* **Mongoose: `new Model()` vs. `Model.create()`:** I discovered a critical distinction in Mongoose's document creation methods. `Model.create()` is a convenient "fire and forget" method that saves a document instantly. However, for the seeder, I needed to link newly created `Problem` documents to their parent `Topic` document. This required using `const topic = new Topic()` first, then `await topic.save()` to get the `_id` of the saved document, which could then be used as a reference when creating the associated problems. This hands-on experience was crucial for understanding how to manage relationships between documents in Mongoose.