# parse_times.py
# author: Matthew Stevens

stops_file = "/Users/matthewstevens/Desktop/stops.txt"
stop_times_file = "/Users/matthewstevens/Downloads/stop_times.txt"

stop_info = {}

with open(stops_file) as f:
    lines = f.readlines()

    for line in lines:
        line_array = line.split(",")

        stop_id = line_array[0]
        lat = line_array[3]
        lon = line_array[4]

        info_array = [lat, lon, 0]
        stop_info[stop_id] = info_array

with open(stop_times_file) as f:
    lines = f.readlines()

    for line in lines:
        line_array = line.split(",")

        stop_id = line_array[3]

        if stop_info.get(stop_id) != None:
            updated_count = stop_info[stop_id][2] + 1
            updated_array = stop_info[stop_id]
            updated_array[2] = updated_count
            stop_info[stop_id] = updated_array

outfile = open("stop_information.csv", "w+")

outfile.write("stop_id,lat,long,count\n")

for key, values in stop_info.items():
    line_string = str(key) + "," + str(values[0]) + "," + str(values[1]) + "," + str(values[2]) + "\n"
    outfile.write(line_string)

outfile.close()
