package HackerRanker;

import java.util.Arrays;
import java.util.Scanner;

public class walkingInLowerDimension {
	public static void main(String args[]) throws Exception {
		/*
		 * Sample code to perform I/O: Use either of these methods for input
		 * 
		 * //BufferedReader BufferedReader br = new BufferedReader(new
		 * InputStreamReader(System.in)); String name = br.readLine(); // Reading input
		 * from STDIN System.out.println("Hi, " + name + "."); // Writing output to
		 * STDOUT
		 * 
		 * //Scanner Scanner s = new Scanner(System.in); String name = s.nextLine(); //
		 * Reading input from STDIN System.out.println("Hi, " + name + "."); // Writing
		 * output to STDOUT
		 * 
		 */

		Scanner sc = new Scanner(System.in);

		long L = 0, R = 0;
		int STEP_SIZE = 0;

		L = sc.nextLong();
		R = sc.nextLong();
		STEP_SIZE = sc.nextInt();

		int N = sc.nextInt();
		long arr[] = new long[N];
		for (int i = 0; i < N; i++)
			arr[i] = sc.nextLong();
		 solve(L, R, STEP_SIZE, arr, N);
		
	}

	public static void solve(long L, long R, int STEP_SIZE, long[] arr, long N) {
		int left=0,right=0;
		Arrays.sort(arr);
		for (long i = L; i <= arr[arr.length-1]; i += STEP_SIZE) {
			if(Arrays.binarySearch(arr, i)>=0) {
				left++;
			}
		}
		for (long i = R; i <= arr[arr.length-1]; i += STEP_SIZE) {
			if(Arrays.binarySearch(arr, i)>=0) {
				right++;
			}
		}
		// Write your code here
		System.out.println(left+" "+right);
		
	}

}

/**
 * Input format
 * 
 * First line: Three space-separated integers and that denote the initial
 * position of Monotron's left leg, initial position of Monotron's right leg,
 * size of each step taken by Monotron Note: The step size of both the legs are
 * fixed and the same
 * 
 * Second line: An integer denoting the number of mines planted by the Mayor
 * Monu. Next line: space-separated integers denoting the position of the mine
 * Output format
 * 
 * Print two space-separated integers denoting the number of mines destroyed by
 * Monotron's left leg and right leg respectively.
 * 
 * Constraints
 * 
 * SAMPLE INPUT 1 2 3 8 16 10 13 4 8 7 15 20 SAMPLE OUTPUT 5 2
 **/
