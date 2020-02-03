package HackerRanker;

import java.util.Scanner;

public class PrimeCheck {
	public static void main(String[] args) {
		Scanner s = new Scanner(System.in);
		int n = s.nextInt();
		int arr[] = new int[n];
		int i;
		for (i = 0; i < n; i++) {
			arr[i] = s.nextInt();
		}
		extracted(arr);
	}

	private static void extracted(int[] arr) {
		int i;boolean isPrime = true;
		for (i = 0; i < arr.length; i++) {
			isPrime = true;
			if(arr[i]==1) {
				isPrime =false;
			}
			if(arr[i]==2) {
				isPrime =true;
			}
			int sqrt = (int) Math.sqrt(arr[i]);
		    for (int j = 2; j <= sqrt; j++) {
				if(arr[i]%j==0) {
					isPrime =false;
					break;
				}
			}
		    if(isPrime) {
		    	System.out.println("Prime");
		    }else {
		    	System.out.println("Not Prime");
		    }
		}
		
	
	}
}
