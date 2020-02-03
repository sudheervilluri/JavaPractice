package DataStructures;

public class BubbleSort {

	static int arr[] = { 2, 5, 4, 6, 1 };

	public static void main(String[] args) {

		bubblesort(arr);
	}

	static void bubblesort(int arr[]) {
		int count=0;
		for (int i = 0; i < arr.length-1; i++) {
			for (int j = 0; j < arr.length-i-1; j++) {
				if(arr[j]>arr[j+1]) {
					int temp=arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
					count++;
				}
			}
		}
		for (int i : arr) {
			System.out.println(count);
		}
	}

}
class Printer<T> {
    
}