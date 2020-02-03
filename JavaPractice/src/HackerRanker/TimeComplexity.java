package HackerRanker;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Scanner;

public class TimeComplexity {

	/*
	 * Complete the timeConversion function below.
	 */
	static String timeConversion(String s) {
		String[] time = s.split(":");
		int h = Integer.parseInt(time[0]);
		if (time[time.length - 1].contains("PM")) {
			time[0] = (h+12)+"";
			time[2]=time[2].replace("PM", "");
		}else {
			if(h==12) {
				time[0] = "00";
			}
			time[2]=time[2].replace("AM", "");
		}
		return time[0]+":"+time[1]+":"+time[2];
	}

	private static final Scanner scan = new Scanner(System.in);

	public static void main(String[] args) throws IOException {
		BufferedWriter bw = new BufferedWriter(new FileWriter("OUTPUT_PATH"));

		String s = scan.nextLine();

		String result = timeConversion(s);

		System.out.println(result);
		bw.write(result);
		bw.newLine();

		bw.close();
	}
}
