package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Arrays;
import java.util.Scanner;

/**
 * Sample Input 0

2 5
2 3
Sample Output 0

6
Explanation 0

In  days  can produce  items and  can produce  items. This totals up to .
 * @author SV065115
 *
 */

public class MinimumTimeRequired {

	// Complete the minTime function below.
	static long minTime(long[] machines, long goal) {
		 Arrays.sort(machines);
	        long max = machines[machines.length - 1];
	        long minDays = 0;
	        long maxDays = max*goal;
	        long result = -1;
	        while (minDays < maxDays) {
	            long mid = (minDays + maxDays) / 2;
	            long unit = 0;
	            for (long machine : machines) {
	                unit += mid / machine;
	            }
	            if (unit < goal) {
	                minDays = mid+1;
	            } else {
	                result = mid;
	                maxDays = mid;
	            }
	        }
	        return result;
	}

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String[] nGoal = scanner.nextLine().split(" ");

		int n = Integer.parseInt(nGoal[0]);

		long goal = Long.parseLong(nGoal[1]);

		long[] machines = new long[n];

		String[] machinesItems = scanner.nextLine().split(" ");
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int i = 0; i < n; i++) {
			long machinesItem = Long.parseLong(machinesItems[i]);
			machines[i] = machinesItem;
		}

		long ans = minTime(machines, goal);
		System.out.println(ans);
		bufferedWriter.write(String.valueOf(ans));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
