class Addition {
	
	//Overloaded methods are differentiated based on the number and type of the parameters passed as an arguments to the methods.
	//You can not define more than one method with the same name, Order and the type of the arguments. It would be compiler error.
	//The compiler does not consider the return type while differentiating the overloaded method. But you cannot declare two methods with the same signature and different return type. It will throw a compile time error.
	//If both methods have same parameter types, but different return type, then it is not possible. (Java SE 8 Edition, §8.4.2)
	
	//Overloading with different arg
	public int add(int a,int b) {
		return a+b;
	}
	
	public int add(double a,double b) {
		return (int) (a+b);
	}
	
	//Same arg cannot have diff return type
	public double add(int a,double b) {
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