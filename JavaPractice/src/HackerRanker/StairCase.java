package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Scanner;

public class StairCase {

	// Complete the stepPerms function below.
	static int stepPerms(int n) {
		if (n == 1) {
			return 1;
		}
		int[] m = new int[n + 1];
		m[0] = 1;
		return helper(n, m);
	}

	private static int helper(int n, int[] m) {
		System.out.println(n + " "+ Arrays.toString(m) );
		if (n < 0) {
			return 0;
		}
		if (m[n] != 0) {
			return m[n];
		}
		if (n == 1) {
			return 1;
		}
		m[n] = helper(n - 3, m) + helper(n - 2, m) + helper(n - 1, m);
		System.out.println(n + " ===  "+ Arrays.toString(m) );
		return m[n];
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		int s = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int sItr = 0; sItr < s; sItr++) {
			int n = scanner.nextInt();
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			int res = stepPerms(n);

			bufferedWriter.write(String.valueOf(res));
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}
}
