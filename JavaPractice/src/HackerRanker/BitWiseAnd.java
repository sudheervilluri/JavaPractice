package HackerRanker;

import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class BitWiseAnd {

	private static final Scanner scanner = new Scanner(System.in);

	public static void main(String[] args) {
		int t = scanner.nextInt();
		scanner.skip("(\r\n|[\n\r\u2028\u2029\u0085])?");

		for (int tItr = 0; tItr < t; tItr++) {
			String[] nk = scanner.nextLine().split(" ");

			int n = Integer.parseInt(nk[0]);

			int k = Integer.parseInt(nk[1]);
			System.out.println(getBitWiseCombination(n, k));
		}

		scanner.close();
	}

	static int getBitWiseCombination(int n, int k) {
		int count2 = 0,count=0,index=1;
		Map<Integer, Integer> mp = new HashMap();
		for (int i = 1; i <= n; i++) {
			for (int j = i + 1; j <= n; j++) {
				byte a = (byte) i;
				byte b = (byte) j;
			//	System.out.println(a & b);
				mp.put(a & b, mp.get(a & b) == null ? 1 : mp.get(a & b) + 1);
			}
		}
		for (Integer i : mp.keySet()) {
			int value = mp.get(i);
			if(value > count2 && i!=0 && index>=k ) {
				count2 = value;
				count = i;
			}
			index++;
		}
		return count;
	}
}
