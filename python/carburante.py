import tarfile
import os
import re
import datetime

# Path to the .tgz file
output_directory = r"C:\Users\giamt\Downloads"  # Specify the output directory
tgz_file_path = "2025_2_tr"


# Extract the .tgz file
with tarfile.open(output_directory + "\\" + tgz_file_path + ".tar.gz", 'r:gz') as tar:
    tar.extractall(path=output_directory)  # Specify the extraction directory
    print(f"Extracted files to '{output_directory}'")

    # Directory to search for files
    search_directory = output_directory + "\\" + tgz_file_path  # Adjust this path as needed

    # Pattern to search for
    pattern = "11712;Benzina"  # Replace with your desired search pattern

    lines = []
    # Iterate through all files in the directory
    for root, dirs, files in os.walk(search_directory):
        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    for line_number, line in enumerate(f, start=1):
                        if re.search(pattern, line):
                            # print(f"Match found in {file_path} on line {line_number}: {line.strip()}")
                            lines.append(line.strip())
            except (UnicodeDecodeError, PermissionError) as e:
                print(f"Could not read file {file_path}: {e}")

    grouped_data = {}
    for line in lines:
        parts = line.split(';')
        if len(parts) > 1:
            print(f"{line} -> Price: {parts[2]}, Date: {parts[4]}")
            try:
                parsed_date = datetime.datetime.strptime(parts[4], '%d/%m/%Y %H:%M:%S')
                month_year = parsed_date.strftime('%Y-%m')  # Extract year and month
                if month_year not in grouped_data:
                    grouped_data[month_year] = [0.0, 0]  # Initialize with [total_price, count]
                grouped_data[month_year][0] += float(parts[2])  # Add price to total
                grouped_data[month_year][1] += 1  # Increment count
            except ValueError as e:
                print(f"Error parsing date '{parts[4]}': {e}")
        else:
            print(f"Unparsable line: {line}")
    
    # Print the grouped data
    for month_year, (total_price, count) in grouped_data.items():
        average_price = total_price / count if count > 0 else 0
        print(f"{month_year}: Average Price: {average_price:.3f}, Count: {count}")