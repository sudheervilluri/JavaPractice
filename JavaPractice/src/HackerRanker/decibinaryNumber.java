package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class decibinaryNumber {
	// Complete the decibinaryNumbers function below.
	static long decibinaryNumbers(long x) {
		String in = Long.toBinaryString(x);
		int power=0,sum=0;
		for (int i = 0; i < in.length(); i++) {
			int base = (int) in.charAt(i);
			sum+= base*(Math.pow(2,power));
			power++;
		}
		System.out.println(sum);
		return 0;
		
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(("OUTPUT_PATH")));

		int q = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int qItr = 0; qItr < q; qItr++) {
			long x = scanner.nextLong();
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			long result = decibinaryNumbers(x);

			bufferedWriter.write(String.valueOf(result));
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}
}
