package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class MinimumAbsolute {
	// Complete the minimumAbsoluteDifference function below.
	static int minimumAbsoluteDifference(int[] arr) {
		int min =arr[0];
		for (int i = 0; i < arr.length-1; i++) {
			for (int j = i+1; j < arr.length; j++) {
				//System.out.println(arr[i]+""+arr[j]);
				int value  = Math.abs(arr[i]-arr[j]) ;
				System.out.println(value);
				if(value<min) {
					min = value;
				}
			}
		}
		return min;
		
	}
	
	static int pairs(int k, int[] arr) {
	    int res = 0;
	    Map<Integer, Integer> complements = new HashMap<>();
	    for (int el : arr) {
	        if (complements.containsKey(el)) {
	            res = res + complements.get(el);
	        }
	        if (el - k > 0) {
	            complements.compute(el - k, (key, value) -> (value == null) ? 1 : value + 1);
	        }
	        complements.compute(el + k, (key, value) -> (value == null) ? 1 : value + 1);
	    }
	    return res;
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(("OUTPUT_PATH")));

		int n = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		int[] arr = new int[n];

		String[] arrItems = scanner.nextLine().split(" ");
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int i = 0; i < n; i++) {
			int arrItem = Integer.parseInt(arrItems[i]);
			arr[i] = arrItem;
		}

		int result = minimumAbsoluteDifference(arr);

		System.out.println(result);
		bufferedWriter.write(String.valueOf(result));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
