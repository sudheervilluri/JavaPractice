package HackerRanker.LuckBalance;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

public class LuckBalance {
	// Complete the luckBalance function below.
	static int luckBalance(int k, int[][] contests) {
		int sum = 0;
		List<Integer> arrayList = new ArrayList();
		for (int i = 0; i < contests.length; i++) {
			sum += contests[i][0];
			if (contests[i][1] == 1) {
				arrayList.add(contests[i][0]);
			}

		}
		Collections.sort(arrayList);

		int j = 0;
		for (int i = 0; i < arrayList.size() - k; i++) {

			sum -= (2 * arrayList.get(i));

		}

		return sum;
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter(System.getenv("OUTPUT_PATH")));

		String[] nk = scanner.nextLine().split(" ");

		int n = Integer.parseInt(nk[0]);

		int k = Integer.parseInt(nk[1]);

		int[][] contests = new int[n][2];

		for (int i = 0; i < n; i++) {
			String[] contestsRowItems = scanner.nextLine().split(" ");
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			for (int j = 0; j < 2; j++) {
				int contestsItem = Integer.parseInt(contestsRowItems[j]);
				contests[i][j] = contestsItem;
			}
		}

		int result = luckBalance(k, contests);

		bufferedWriter.write(String.valueOf(result));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
