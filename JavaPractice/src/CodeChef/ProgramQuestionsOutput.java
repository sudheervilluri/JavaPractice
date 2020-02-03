package CodeChef;

public class ProgramQuestionsOutput {
	public static void main(String[] args) {
		Welcome w = new Welcome(2, 3);
		System.out.println(w.x);
		System.out.println(fun());
	}
	
	static int fun() {
		//static int x =0;
		//Static veriable cannot declare in static methods
		int x =0;
		return x++;
	}
}

class Welcome {
	protected int x = 0, y = 0;
	public Welcome(int _x,int _y){
		x = _x;
		y = _y;
	}
	
}