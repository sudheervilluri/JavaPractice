public class PerfectPower {
public static void main(String[] args) {
	int x = 25;
	int y = x;
	int p = 1;
	for (int i = (int)Math.sqrt(x); i > 0; i--) {
		for (int exp = 2; exp < 32; exp++) {
			if ((int)Math.pow(i, exp) == x) {
				if (exp > p) {
					y = i;
					p = exp;
				}
				break;
			} else if ((int)Math.pow(i, exp) >= x) {
				break;
			}
		}
	}
	System.out.println(p);
}
	

}