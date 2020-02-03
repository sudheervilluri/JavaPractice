package HackerRanker.StringCamparison;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Date;
import java.util.Scanner;

public class StringCamprision {

	// Complete the twoStrings function below.
	static String twoStrings(String s1, String s2) {

		System.out.println("Start" + new Date());
		char[] s1Array = s1.toCharArray();
		boolean isPresent = false;
		int lengthValue = s1Array.length;
		for (int i = 0; i < lengthValue; i++) {
			if (s2.indexOf(s1Array[i]) >= 0) {
				isPresent = true;
				break;
			}
		}
		System.out.println("End" + new Date());
		if (isPresent) {
			return "YES";
		} else {
			return "NO";
		}
	}

	static String thirdApproach(String s1, String s2) {

		boolean isPresent = false;
		for(int i=65;i<123;i++){
			char c = (char) i;
			
			if(s1.indexOf(c) >= 0 && s2.indexOf(c)>=0) {
				isPresent = true;
				break;
			}
		}
		if (isPresent) {
			return "YES";
		} else {
			return "NO";
		}
	}

	public static void main(String[] args) throws IOException {
		BufferedWriter bufferedWriter = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		File file = new File(
				"C:\\Users\\SV065115\\OneDrive - Cerner Corporation\\Desktop\\Drive\\Work\\HIUI\\Workspace\\temp\\JavaPractice\\JavaPractice\\src\\HackerRanker\\StringCamparison\\input07.txt");
		Scanner scanner = new Scanner(file);
		int q = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int qItr = 0; qItr < q; qItr++) {
			String s1 = scanner.nextLine();

			String s2 = scanner.nextLine();

			String result = thirdApproach(s1, s2);

			bufferedWriter.write(result);
			bufferedWriter.newLine();
		}

		bufferedWriter.close();

		scanner.close();
	}
}
