package HackerRanker.MinimumSwaps;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class Solution {
	// Complete the minimumSwaps function below.
	static int minimumSwaps(int[] arr) {
		int count=0;
	    int temp=0;
	    for(int i=0; i<arr.length;) {
	        if(arr[i] != i+1){
	            temp = arr[i];
	            arr[i]= arr[temp-1];
	            arr[temp-1] = temp;
	            count++;
	        }
	        else
	            i++;
	    }
	  //  System.out.println(count);
		return count;
	}

	public static void main(String[] args) throws IOException {
		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\MinimumSwaps\\input00.txt");
		Scanner scanner = new Scanner(file);
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

		int res = minimumSwaps(arr);

		System.out.println(res);
		bufferedWriter.write(String.valueOf(res));
		bufferedWriter.newLine();

		bufferedWriter.close();

		scanner.close();
	}
}
