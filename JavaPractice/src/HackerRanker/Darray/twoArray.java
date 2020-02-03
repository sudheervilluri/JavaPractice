package HackerRanker.Darray;

import java.io.File;
import java.util.Scanner;

public class twoArray {

	public static void main(String[] args) throws Exception {
		int[][] arr = new int[6][6];
		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\Darray\\input01.txt");
		Scanner scanner = new Scanner(file);
		for (int i = 0; i < 6; i++) {
			String[] arrRowItems = scanner.nextLine().split(" ");
			scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

			for (int j = 0; j < 6; j++) {
				int arrItem = Integer.parseInt(arrRowItems[j]);
				arr[i][j] = arrItem;
			}
		}
		maxValue(arr);

		scanner.close();
	}

	static void maxValue(int[][] arr) {
		int sum = 0,maxvalue=-100;
		for (int i = 0; i < 4; i++) {
			
			//for (int j = 0; j < 4; j++) {
				for (int j = 0; j < 4; j++) {
					sum = arr[i][j] + arr[i][j+1] + arr[i][j+2]
		                    + arr[i+1][j+1] + arr[i+2][j] + arr[i+2][j+1]
		                    + arr[i+2][j+2];
				
					if(sum > maxvalue)
					{
						maxvalue= sum;
					}
				}
				
			//}
		}
		System.out.println(maxvalue);
	}

}
