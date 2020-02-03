
public class BirarySearch {
	
	
public static void main(String[] args) {
	BirarySearch ob = new BirarySearch();
     int arr[] = {2,3,4,10,40};
     int n = arr.length;
     int x = 10;
     int result = ob.binarySearch(arr,0,n-1,x);
     if (result == -1)
         System.out.println("Element not present");
     else
         System.out.println("Element found at index " + 
                                              result);
 
}

	 int binarySearch(int[] arr,int start,int end,int x) {
		 
		 int mid = (end+start)/2 +1;
		 if(arr[mid] == x) {
			 return mid;
		 }else if(arr[mid]>x) {
			 binarySearch(arr,0,mid-1,x);
		 }else if(arr[mid]<x)
			 binarySearch(arr,mid+1,end,x);
			 
		return -1;
	}


}
