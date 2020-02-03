package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class MaximumSubArraySum {

	// Complete the maximumSum function below.
	static int maxSubsetSum(int[] arr) {
		int oldValue = 0;
		int withValue = arr[0];
		int withoutValue = 0;
		for (int i = 1; i < arr.length; i++) {
			oldValue = withoutValue;
			withoutValue = Math.max(withValue, withoutValue);
			withValue = arr[i] + oldValue;

		}
		return Math.max(withValue, withoutValue);
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		int n = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		int[] arr = new int[n];

		String[] arrItems = scanner.nextLine().split(" ");
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int i = 0; i < n; i++) {
			int arrItem = Integer.parseInt(arrItems[i]);
			arr[i] = arrItem;
		}

		int res = maxSubsetSum(arr);
		System.out.println(res);
		bufferedWriter.write(String.valueOf(res));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
