package HackerRanker;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class BuildingInCities {
	public static void main(String args[]) throws Exception {
		Scanner sc = new Scanner(System.in);
		int N = sc.nextInt();
		long arr[] = new long[N];
		for (int i = 0; i < N; i++)
			arr[i] = sc.nextLong();
		long out = solve(arr, N);
		System.out.println(out);
	}

	public static long solve(long[] arr, long N) {
		long count = 0;
		long[] sqr = new long[arr.length];
		Map<Long, Long> sm = new HashMap();
		int i;
		for (i = 0; i < arr.length; i++) {
			sm.put(arr[i], sm.get(arr[i]) == null ? 1 : sm.get(arr[i]) + 1);
		}
		for (i = 0; i < arr.length; i++) {
			long count2 = 0;
			if (sm.get(arr[i] * arr[i]) != null) {
				count2 = sm.get(arr[i] * arr[i]);
			}
			if (arr[i] != 1) {
				count += count2;
			}
		}
		
		return count;
	}
}

/**
 * Monkland is one of the prestigious cities in the world. An attack was
 * initiated by the robot giant Monotron in which many roads and buildings had
 * been destroyed. You are the Mayor of Monkland and you have planned to restore
 * the city to its lost glory.
 * 
 * There are building in a city and you are required to connect these buildings
 * to each other by constructing directed roads.
 * 
 * Each building contains number of floors. A directed road from building to can
 * be constructed only if and .
 * 
 * Input format
 * 
 * First line: A single integer denoting the number of buildings Second line:
 * space-separated integers denoting the number of floors in the building Output
 * format SAMPLE INPUT 7 1 2 2 4 4 7 4
 * 
 * SAMPLE OUTPUT 6 Print a single integer denoting the total number of roads
 * that must be constructed to connect buildings.
 **/