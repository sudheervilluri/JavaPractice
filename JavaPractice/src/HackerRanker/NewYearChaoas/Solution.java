package HackerRanker.NewYearChaoas;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

public class Solution {

	// Complete the minimumBribes function below.
	static void minimumBribes(int[] q) {
		int sum=0;boolean flag=false;
		for (int i = 0; i < q.length; i++) {
			if (q[i] - (i+1) > 2) {
				flag = true;
				break;
			}
			for (int j = Math.max(0, q[i] - 2); j < i; j++)
	            if (q[j] > q[i]) sum++;

		}
		if(flag) {
			System.out.println("Too chaotic");
		}else {
			System.out.println(sum);
		}

	}

	public static void main(String[] args) throws FileNotFoundException {
		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\NewYearChaoas\\input00.txt");
		Scanner scanner = new Scanner(file);
		int t = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int tItr = 0; tItr < t; tItr++) {
			int n = scanner.nextInt();
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			int[] q = new int[n];

			String[] qItems = scanner.nextLine().split(" ");
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			for (int i = 0; i < n; i++) {
				int qItem = Integer.parseInt(qItems[i]);
				q[i] = qItem;
			}

			minimumBribes(q);
		}

		scanner.close();
	}
}