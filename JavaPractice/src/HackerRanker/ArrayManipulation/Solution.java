package HackerRanker.ArrayManipulation;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import java.util.Scanner;

public class Solution {

	// Complete the arrayManipulation function below.
	static long arrayManipulation(int n, int[][] queries) {
		long[] arr = new long[n];
		long max = 0,temp=0;
		System.out.println(new Date());
		for (int i = 0; i < queries.length; i++) {
			int start = queries[i][0];
			int end = queries[i][1];
			int value = queries[i][2];
//			for (int k = start - 1; k < end; k++) {
//				arr[k] += value;
//				if(arr[k]>max) {
//					max= arr[k];
//				}
//			}
			arr[start-1] += value;
		
			if(end<n) {
				arr[end] -= value;
			}
			
			
		}
		System.out.println(new Date());
		  //System.out.println(new Date());
        for (int i = 0; i < arr.length; i++) {
             temp += arr[i];
                if(temp> max) max=temp;
        }
        return max;
    
	}

	public static void main(String[] args) throws IOException {

		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\ArrayManipulation\\input07.txt");
		Scanner scanner = new Scanner(file);

		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String[] nm = scanner.nextLine().split(" ");

		int n = Integer.parseInt(nm[0]);

		int m = Integer.parseInt(nm[1]);

		int[][] queries = new int[m][3];

		for (int i = 0; i < m; i++) {
			String[] queriesRowItems = scanner.nextLine().split(" ");
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			for (int j = 0; j < 3; j++) {
				int queriesItem = Integer.parseInt(queriesRowItems[j]);
				queries[i][j] = queriesItem;
			}
		}

		long result = arrayManipulation(n, queries);

		System.out.println(result);
		bufferedWriter.write(String.valueOf(result));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
