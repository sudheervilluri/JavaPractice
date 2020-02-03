/**
 * 
 */
package HackerRanker;

import java.util.Scanner;

/**
 * @author SV065115
 *
 */
public class NestedLogic {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		Scanner scan = new Scanner(System.in);
		int actualDay = scan.nextInt();
		int actualMonth = scan.nextInt();
		int actualYear = scan.nextInt();
		int expectedDay = scan.nextInt();
		int expectedMonth = scan.nextInt();
		int expectedYear = scan.nextInt();
		scan.close();
		int monthsLate = actualMonth - expectedMonth;
		int daysLate = actualDay - expectedDay;
		int yearDiference = actualYear - expectedYear;

		System.out.println((actualYear - expectedYear > 0) ? 10000
				: (actualMonth - expectedMonth > 0 && yearDiference == 0) ? monthsLate * 500
						: (actualDay - expectedDay > 0 && yearDiference == 0) ? daysLate * 15 : 0);
	}

}
