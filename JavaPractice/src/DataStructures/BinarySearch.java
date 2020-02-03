package DataStructures;

public class BinarySearch {
	static int arr[] = { 2, 3, 4, 10, 40 };

	public static void main(String[] args) {

		System.out.println(binarSearchOperation(arr,10));
	}

	static int binarSearchOperation(int arr[], int value) {
		int l = 0, r = arr.length - 1;
		while (l <= r) {
			int m = l + (r - l) / 2;
			if (arr[m] == r)
				return r;
			if (arr[m] < value)
				l = m + 1;
			else
				r = m - 1;
		}
		return -1;

	}
}
