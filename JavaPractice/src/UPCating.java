class Super{
	void Sample() {
	      System.out.println("method of super class");
	   }
}
public class UPCating extends Super{
	void Sample() {
	      System.out.println("method of sub class");
	   }
	
	public static void main(String[] args) {
		//Down Casting
//		Super p = new UPCating();
//		p.Sample();
		
		Super s= new UPCating();
		UPCating u = (UPCating) s;
		u.Sample();
		
	}
	
	
	
}
