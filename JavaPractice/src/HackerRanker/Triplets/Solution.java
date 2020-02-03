package HackerRanker.Triplets;

import static java.util.stream.Collectors.toList;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

public class Solution {

	// Complete the countTriplets function below.
	static long countTriplets(List<Long> arr, long r) {

		Set<String> list = new HashSet();
		for (int i = 0; i < arr.size(); i++) {
			for (int j = i + 1; j < arr.size(); j++) {
				for (int k = j + 1; k < arr.size(); k++) {
					if (arr.get(i) < arr.get(j) && arr.get(j) < arr.get(k) ) {
						System.out.println(arr.get(i) + "," + arr.get(j) + "," + arr.get(k));
						if(arr.get(k)%r == 0) {
							list.add(arr.get(i) + "," + arr.get(j) + "," + arr.get(k));
						}
						list.add(arr.get(i) + "," + arr.get(j) + "," + arr.get(k));
					}
				}
			}
		}

		return list.size();

	}

	public static void main(String[] args) throws IOException {
		BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(System.in));
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String[] nr = bufferedReader.readLine().replaceAll("\\s+$", "").split(" ");

		int n = Integer.parseInt(nr[0]);

		long r = Long.parseLong(nr[1]);

		List<Long> arr = Stream.of(bufferedReader.readLine().replaceAll("\\s+$", "").split(" ")).map(Long::parseLong)
				.collect(toList());

		long ans = countTriplets(arr, r);

		System.out.println(ans);
		bufferedWriter.write(String.valueOf(ans));
		bufferedWriter.newLine();

		bufferedReader.close();
		bufferedWriter.close();
	}
}
