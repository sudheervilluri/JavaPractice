class Addition {

	// adding three integer values.
	public int add(int a, int b, int c) {

		int sum = a + b + c;
		return sum;
	}

	public int add(long a, int b) {
		System.out.println("From here");
		return (int) (a + b);
	}

	// adding two integer values.
	public int add(int a, int b) {

		int sum = a + b;
		return sum;
	}
	
	public String add(String a, String b) {
		return a+b;
	}
}

class OverLoading {
	public static void main(String[] args) {

		Addition ob = new Addition();

		int sum1 = ob.add(1, 2);
		System.out.println("sum of the two integer value :" + sum1);
		int sum2 = ob.add(1, 2, 3);
		System.out.println("sum of the three integer value :" + sum2);

		String test = ob.add("Sudheer","Villuri");
		System.out.println(test);
		
	}
}