package HackerRanker.RotateLeft;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Scanner;

public class Solution {

	// Complete the rotLeft function below.
	static int[] rotLeft(int[] a, int d) {

		while(d>0) {
		int temp = a[0];
		for(int i=0;i<a.length-1;i++) {
			a[i] = a[i+1];
		}
		a[a.length-1] = temp;
		d--;
		}
		return a;
	}

	public static void main(String[] args) throws IOException {
		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\RotateLeft\\input00.txt");
		Scanner scanner = new Scanner(file);
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String[] nd = scanner.nextLine().split(" ");

		int n = Integer.parseInt(nd[0]);

		int d = Integer.parseInt(nd[1]);

		int[] a = new int[n];

		String[] aItems = scanner.nextLine().split(" ");
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int i = 0; i < n; i++) {
			int aItem = Integer.parseInt(aItems[i]);
			a[i] = aItem;
		}

		int[] result = rotLeft(a, d);
		System.out.println( Arrays.toString(result));
		for (int i = 0; i < result.length; i++) {
			bufferedWriter.write(String.valueOf(result[i]));

			if (i != result.length - 1) {
				bufferedWriter.write(" ");
			}
		}

		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
